import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { routeInputSchema, routeResultSchema } from './schema.js';
import type { RouteInput, RouteResult } from './schema.js';

export async function route(input: RouteInput, options: RecipeOptions = {}): Promise<RouteResult> {
  const { request, routes, minConfidence = 0.8 } = routeInputSchema.parse(input);
  const decision = await evaluateChoice(
    { request },
    'Choose the single route that best handles request. Use __review__ when no route clearly fits.',
    { ...routes, __review__: 'The request is ambiguous, no route fits, or more information is needed.' },
    options,
    'route',
  );
  const suggestedRoute = decision.verdict === '__review__' ? null : decision.verdict;
  const requiresReview = suggestedRoute === null || decision.confidence < minConfidence;

  return routeResultSchema.parse({
    status: requiresReview ? 'review' : 'ready',
    route: requiresReview ? null : suggestedRoute,
    suggestedRoute,
    confidence: decision.confidence,
    probabilities: decision.probabilities,
    model: decision.model,
    usage: decision.usage,
  });
}

export { routeInputSchema, routeResultSchema } from './schema.js';
export type { RouteInput, RouteResult } from './schema.js';
