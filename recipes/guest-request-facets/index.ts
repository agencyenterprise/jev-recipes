import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { guestRequestFacetsInputSchema, guestRequestFacetsResultSchema } from './schema.js';
import type { GuestRequestFacetsInput, GuestRequestFacetsResult } from './schema.js';

export async function guestRequestFacets(
  input: GuestRequestFacetsInput,
  options: RecipeOptions = {},
): Promise<GuestRequestFacetsResult> {
  const { minConfidence = 0.8, ...state } = guestRequestFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesDates: {
        instruction:
          'Does request state the dates or date range of the stay or visit, such as specific days, a month with a duration, or check-in and check-out days?',
        criteria: {
          true: 'The request names when the stay or visit would take place.',
          false: 'The request gives no dates or period for the stay.',
        },
      },
      statesPartySize: {
        instruction:
          'Does request state how many people are in the party, either as a number or an enumerated list of travelers?',
        criteria: {
          true: 'The request says how many guests or which named people are traveling.',
          false: 'The request does not indicate how many people are coming.',
        },
      },
      statesAccessibilityNeeds: {
        instruction:
          'Does request state an accessibility need, such as step-free access, a wheelchair-accessible room, a ground-floor room for mobility reasons, or accommodations for a sensory or medical condition?',
        criteria: {
          true: 'The request names an accessibility or mobility accommodation the party needs.',
          false: 'The request mentions no accessibility need.',
        },
      },
      statesBudget: {
        instruction: 'Does request state a budget, price ceiling, or price range for the booking?',
        criteria: {
          true: 'The request gives an amount, ceiling, or range the guest is willing to pay.',
          false: 'The request gives no price figure or range.',
        },
      },
      statesOccasion: {
        instruction:
          'Does request state a special occasion for the trip, such as an anniversary, birthday, honeymoon, graduation, or reunion?',
        criteria: {
          true: 'The request names an occasion being celebrated or marked by the trip.',
          false: 'The request mentions no special occasion.',
        },
      },
    },
    options,
  );
  return guestRequestFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  guestRequestFacetsInputSchema,
  guestRequestFacetsResultSchema,
  guestRequestFacetsLabelSchema,
} from './schema.js';
export type {
  GuestRequestFacetsInput,
  GuestRequestFacetsResult,
  GuestRequestFacetsLabel,
} from './schema.js';
