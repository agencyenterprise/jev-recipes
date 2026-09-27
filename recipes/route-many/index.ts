import { choice } from '@typesafe-ai/sdk';
import { evaluateWithJev } from '../../src/client.js';
import { parseChoiceAnswer } from '../../src/answers.js';
import { evaluateInBatches } from '../../src/batch.js';
import { asDecisionInstruction, parseDecisionState } from '../../src/decisions.js';
import type { RecipeOptions, TextItem } from '../../src/schema.js';
import { routeManyInputSchema, routeManyResultSchema } from './schema.js';
import type { RouteManyInput, RouteManyItem, RouteManyResult } from './schema.js';

export async function routeMany(
  input: RouteManyInput,
  options: RecipeOptions = {},
): Promise<RouteManyResult> {
  const {
    requests,
    routes,
    batchSize = 20,
    minConfidence = 0.8,
  } = routeManyInputSchema.parse(input);
  const criteria = {
    ...routes,
    __review__: 'The request is ambiguous, no route fits, or more information is needed.',
  };
  const labels = Object.keys(criteria);
  const evaluation = await evaluateInBatches(requests, batchSize, async (chunk) => {
    const response = await evaluateWithJev(
      {
        state: parseDecisionState({ requests: chunk, routes }),
        questions: Object.fromEntries(
          chunk.map((_, index) => [
            `request_${index}`,
            choice(
              asDecisionInstruction(
                `Choose the single route that best handles requests[${index}].text. Judge only that request. Use __review__ when no route clearly fits.`,
              ),
              criteria,
            ),
          ]),
        ),
      },
      options,
    );
    return {
      items: chunk.map((request, index) =>
        resolveItem(
          request,
          parseChoiceAnswer(response.answers[`request_${index}`], labels),
          minConfidence,
        ),
      ),
      model: response.model,
      usage: response.usage,
    };
  });
  return routeManyResultSchema.parse({
    ...evaluation,
    status: evaluation.items.some((item) => item.status === 'review') ? 'review' : 'ready',
    routed: evaluation.items.filter((item) => item.route !== null).length,
    requestCount: requests.length,
    requestsMade: Math.ceil(requests.length / batchSize),
  });
}

function resolveItem(
  request: TextItem,
  answer: { choice: string; confidence: number; probabilities: Record<string, number> },
  minConfidence: number,
): RouteManyItem {
  const suggestedRoute = answer.choice === '__review__' ? null : answer.choice;
  const requiresReview = suggestedRoute === null || answer.confidence < minConfidence;
  return {
    id: request.id,
    status: requiresReview ? 'review' : 'ready',
    route: requiresReview ? null : suggestedRoute,
    suggestedRoute,
    confidence: answer.confidence,
    probabilities: answer.probabilities,
  };
}

export { routeManyInputSchema, routeManyResultSchema, routeManyItemSchema } from './schema.js';
export type { RouteManyInput, RouteManyResult, RouteManyItem } from './schema.js';
