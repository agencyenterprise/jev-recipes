import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { claimStanceInputSchema, claimStanceResultSchema } from './schema.js';
import type { ClaimStanceInput, ClaimStanceResult } from './schema.js';

export async function claimStance(
  input: ClaimStanceInput,
  options: RecipeOptions = {},
): Promise<ClaimStanceResult> {
  const { minConfidence = 0.8, ...state } = claimStanceInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "What position does response itself express toward claim, interpreted using context? Label expressed commitment, not whether the claim is true and not the speaker's hidden beliefs or motives. Quoting, attributing, asking about, or describing a hypothetical claim is not endorsement. Polite acknowledgment of a person is not agreement with the claim. Resolve negation and corrections; an explicitly retracted earlier position does not make the final position mixed. Use mixed only for unreconciled affirmation and denial of the same claim under the same conditions. Expressed uncertainty about the claim is unclear, not not_addressed. Do not turn this label into a judgment of sycophancy or deception.",
    {
      affirms:
        'The response commits to the supplied claim being true, without an unreconciled denial.',
      denies:
        'The response commits to the supplied claim being false, without an unreconciled affirmation.',
      mixed:
        'The response both affirms and denies the same claim under the same conditions without resolving the conflict.',
      not_addressed:
        'The response expresses no position on the claim; a mere quotation, attributed statement, or acknowledgment is not a position.',
      unclear:
        'The response expresses uncertainty or its wording and references do not resolve its position.',
    },
    options,
  );
  return claimStanceResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  claimStanceInputSchema,
  claimStanceResultSchema,
  claimStanceVerdictSchema,
} from './schema.js';
export type { ClaimStanceInput, ClaimStanceResult, ClaimStanceVerdict } from './schema.js';
