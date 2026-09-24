import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { fairHousingWordingInputSchema, fairHousingWordingResultSchema } from './schema.js';
import type { FairHousingWordingInput, FairHousingWordingResult } from './schema.js';

export async function fairHousingWording(
  input: FairHousingWordingInput,
  options: RecipeOptions = {},
): Promise<FairHousingWordingResult> {
  const { minConfidence = 0.8, ...state } = fairHousingWordingInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Read the listing text and decide whether it expresses a preference for, or a limitation on, who should apply or live there based on personal characteristics such as family status, age, religion, national origin, race, sex, disability, or source of income. Judge the wording as written: statements about the ideal or unsuitable applicant count, while descriptions of the property, its features, its rules for all occupants, and its surroundings (including nearby schools or places of worship) do not. Ignore tone, typos, and whether the rest of the listing is accurate.',
    {
      true: 'The listing states or clearly implies who should or should not apply or live there by reference to a personal characteristic, such as calling the unit ideal for a particular kind of person or unsuitable for families, children, or a group.',
      false:
        'The listing describes the property, its features, its price and terms, and its location without stating a preference for or limitation on applicants by personal characteristic.',
    },
    options,
  );
  return fairHousingWordingResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'flagged' : 'clean',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  fairHousingWordingInputSchema,
  fairHousingWordingResultSchema,
  fairHousingWordingVerdictSchema,
} from './schema.js';
export type {
  FairHousingWordingInput,
  FairHousingWordingResult,
  FairHousingWordingVerdict,
} from './schema.js';
