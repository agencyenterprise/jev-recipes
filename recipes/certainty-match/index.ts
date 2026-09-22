import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { certaintyMatchInputSchema, certaintyMatchResultSchema } from './schema.js';
import type { CertaintyMatchInput, CertaintyMatchResult } from './schema.js';

export async function certaintyMatch(
  input: CertaintyMatchInput,
  options: RecipeOptions = {},
): Promise<CertaintyMatchResult> {
  const { minConfidence = 0.8, ...state } = certaintyMatchInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does the certainty expressed in draft match assessment? Treat assessment as the supplied evidence assessment and do not independently re-evaluate its truth.',
    {
      overstated: 'The draft expresses stronger certainty than the assessment supports.',
      appropriate: 'The draft expresses a degree of certainty consistent with the assessment.',
      understated: 'The draft expresses materially weaker certainty than the assessment supports.',
      unclear: 'The certainty levels cannot be compared from the supplied wording.',
    },
    options,
  );
  return certaintyMatchResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  certaintyMatchInputSchema,
  certaintyMatchResultSchema,
  certaintyMatchVerdictSchema,
} from './schema.js';
export type { CertaintyMatchInput, CertaintyMatchResult, CertaintyMatchVerdict } from './schema.js';
