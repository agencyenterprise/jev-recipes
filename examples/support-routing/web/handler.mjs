import { z } from 'zod';
import { proposeSupportRoute } from '../workflow.mjs';
import { scenarios, scenarioOptions, supportRoutes } from '../scenarios.mjs';
import { createGatewayFallback } from '../fallback.mjs';
import { createGatewayClient } from '../../integrations/clients.mjs';

const requestSchema = z
  .object({
    request: z.string().trim().min(1).max(12000).optional(),
    scenario: z.enum(['ready', 'escalation', 'review', 'failure']).default('ready'),
  })
  .strict();

export function routingMode() {
  const mode = process.env.SUPPORT_ROUTING_MODE ?? 'fixture';
  if (!['fixture', 'live'].includes(mode)) throw new Error('Invalid SUPPORT_ROUTING_MODE.');
  return mode;
}

export async function handleRoutingRequest(
  request,
  { mode = routingMode(), createOptions = liveOptions } = {},
) {
  try {
    request.signal.throwIfAborted();
    const text = await request.text();
    if (text.length > 16000)
      return Response.json({ error: 'The request is too large.' }, { status: 413 });
    const input = requestSchema.parse(JSON.parse(text));
    if (mode !== 'fixture' && mode !== 'live') throw new Error('Unknown mode.');
    if (mode === 'live' && !input.request)
      return Response.json({ error: 'Enter a support request.' }, { status: 400 });
    const message = mode === 'fixture' ? scenarios[input.scenario].request : input.request;
    const options = mode === 'fixture' ? scenarioOptions(input.scenario) : createOptions();
    const proposal = await proposeSupportRoute(
      { request: message, routes: supportRoutes },
      { ...options, signal: request.signal },
    );
    return Response.json(
      {
        mode,
        request: message,
        status: proposal.status,
        route: proposal.route,
        source: proposal.source,
        reason: proposal.reason,
        trace: proposal.trace.map((attempt) => ({
          stage: attempt.stage,
          status: attempt.error ? 'failed' : attempt.result?.status,
          route: attempt.error ? null : attempt.result?.route,
          confidence: attempt.stage === 'primary' ? attempt.result?.confidence : undefined,
        })),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (request.signal.aborted || error?.name === 'AbortError')
      return Response.json({ error: 'The request was cancelled.' }, { status: 499 });
    if (error instanceof SyntaxError || error instanceof z.ZodError)
      return Response.json(
        { error: 'Enter a valid request of at most 12,000 characters.' },
        { status: 400 },
      );
    return Response.json(
      { error: 'Routing is unavailable. Check the server configuration and try again.' },
      { status: 503 },
    );
  }
}

function liveOptions() {
  return {
    client: createGatewayClient({ retry: { maxRetries: 0 } }),
    ...(process.env.SUPPORT_FALLBACK_MODEL
      ? { fallback: createGatewayFallback({ model: process.env.SUPPORT_FALLBACK_MODEL }) }
      : {}),
  };
}
