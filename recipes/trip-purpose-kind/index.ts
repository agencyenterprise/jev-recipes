import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { tripPurposeKindInputSchema, tripPurposeKindResultSchema } from './schema.js';
import type { TripPurposeKindInput, TripPurposeKindResult } from './schema.js';

export async function tripPurposeKind(
  input: TripPurposeKindInput,
  options: RecipeOptions = {},
): Promise<TripPurposeKindResult> {
  const { minConfidence = 0.8, ...state } = tripPurposeKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Decide which purpose the traveler expresses for the trip in message, using context only to interpret references in the message. Judge from what the traveler says about why they are going, not from the destination, budget, or booking channel. If the message gives no indication of purpose, or several purposes carry equal weight, choose unclear.',
    {
      business:
        'The traveler says the trip is for work: meetings, a conference for their job, client visits, site work, or employer-directed travel.',
      leisure:
        'The traveler says the trip is for vacation, sightseeing, rest, or recreation with no other stated purpose.',
      family_visit:
        'The traveler says the trip is to visit or spend time with family or close friends where they live.',
      medical:
        'The traveler says the trip is to receive or accompany someone to medical treatment, consultation, or recovery.',
      relocation:
        'The traveler says they are moving to the destination to live, whether permanently or for an extended posting, rather than visiting.',
      event:
        'The traveler says the trip is to attend a specific occasion such as a wedding, concert, festival, sporting event, or graduation that is not their own job.',
      unclear:
        'The message does not express why the traveler is going, or it names several purposes with no dominant one.',
    },
    options,
  );
  return tripPurposeKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  tripPurposeKindInputSchema,
  tripPurposeKindResultSchema,
  tripPurposeKindVerdictSchema,
} from './schema.js';
export type {
  TripPurposeKindInput,
  TripPurposeKindResult,
  TripPurposeKindVerdict,
} from './schema.js';
