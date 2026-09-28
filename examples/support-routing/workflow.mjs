import { route, routeResultSchema } from 'jev-recipes/route';
import {
  supportRequestSchema,
  routingOptionsSchema,
  fallbackResultSchema,
  proposalSchema,
  validateSelectedRoute,
  safeError,
} from './schema.mjs';

export async function proposeSupportRoute(value, options) {
  const input = supportRequestSchema.parse(value);
  const settings = routingOptionsSchema.parse(options);
  settings.signal?.throwIfAborted();
  let primary;
  try {
    primary = await route(input, settings);
  } catch (error) {
    settings.signal?.throwIfAborted();
    if (error?.name === 'AbortError') throw error;
    return primaryFailure(safeError(error));
  }
  return resolveRoutingDecision(input, primary, settings);
}

export async function resolveRoutingDecision(value, decision, { fallback, signal } = {}) {
  const input = supportRequestSchema.parse(value);
  const primary = routeResultSchema.parse(decision);
  validateSelectedRoute(primary, input.routes);
  if (primary.suggestedRoute !== null && !Object.hasOwn(input.routes, primary.suggestedRoute))
    throw new Error('The primary suggestion is not a supplied route.');
  signal?.throwIfAborted();
  const trace = [{ stage: 'primary', result: primary }];

  if (primary.status === 'ready')
    return proposalSchema.parse({
      status: 'ready',
      route: primary.route,
      source: 'primary',
      reason: 'primary-ready',
      trace,
    });
  if (primary.suggestedRoute === null) return review('primary', 'no-clear-route', trace);
  if (!fallback) return review('primary', 'low-confidence', trace);

  const attempt = { stage: 'fallback' };
  trace.push(attempt);
  try {
    signal?.throwIfAborted();
    attempt.result = await fallback(input, { signal });
    signal?.throwIfAborted();
    const result = validateSelectedRoute(fallbackResultSchema.parse(attempt.result), input.routes);
    if (result.status === 'review') return review('fallback', 'fallback-review', trace);
    return proposalSchema.parse({
      status: 'ready',
      route: result.route,
      source: 'fallback',
      reason: 'fallback-ready',
      trace,
    });
  } catch (error) {
    signal?.throwIfAborted();
    if (error?.name === 'AbortError') throw error;
    attempt.error = safeError(error);
    return review('fallback', 'fallback-failed', trace);
  }
}

export function primaryFailure(error) {
  return review('primary', 'primary-failed', [{ stage: 'primary', error }]);
}

function review(source, reason, trace) {
  return proposalSchema.parse({ status: 'review', route: null, source, reason, trace });
}
