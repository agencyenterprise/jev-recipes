import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { itineraryFeasibilityInputSchema, itineraryFeasibilityResultSchema } from './schema.js';
import type { ItineraryFeasibilityInput, ItineraryFeasibilityResult } from './schema.js';

export async function itineraryFeasibility(
  input: ItineraryFeasibilityInput,
  options: RecipeOptions = {},
): Promise<ItineraryFeasibilityResult> {
  const { minConfidence = 0.8, ...state } = itineraryFeasibilityInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Judge whether the consecutive items in itinerary can be carried out in the order described. Consider whether each item leaves enough time to reach the next, whether the stated locations are reachable from one another in the time given, and whether any two commitments overlap. Ignore whether the trip is pleasant, well-priced, or a good use of time.',
    {
      true: 'Every consecutive pair of items in the itinerary leaves plausible transfer time, the locations follow from one another, and no two commitments overlap.',
      false:
        'At least one consecutive pair of items overlaps in time, allows no plausible transfer between the stated locations, or is otherwise impossible to carry out in the order described.',
    },
    options,
  );
  return itineraryFeasibilityResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'feasible' : 'infeasible',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  itineraryFeasibilityInputSchema,
  itineraryFeasibilityResultSchema,
  itineraryFeasibilityVerdictSchema,
} from './schema.js';
export type {
  ItineraryFeasibilityInput,
  ItineraryFeasibilityResult,
  ItineraryFeasibilityVerdict,
} from './schema.js';
