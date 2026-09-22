import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { answerInvalidationInputSchema, answerInvalidationResultSchema } from './schema.js';
import type { AnswerInvalidationInput, AnswerInvalidationResult } from './schema.js';

export async function answerInvalidation(
  input: AnswerInvalidationInput,
  options: RecipeOptions = {},
): Promise<AnswerInvalidationResult> {
  const { minConfidence = 0.8, ...state } = answerInvalidationInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does updatedEvidence still support the entire claim that was based on previousEvidence? Removing necessary support can invalidate the claim even without an explicit contradiction. Do not assume the claim was supported before.',
    {
      still_supported: 'The updated evidence supports the entire claim.',
      invalidated:
        'The previous evidence supported the claim, but the updated evidence contradicts it or removes required support.',
      unclear: 'Previous support or the effect of the new evidence cannot be established.',
    },
    options,
  );
  return answerInvalidationResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  answerInvalidationInputSchema,
  answerInvalidationResultSchema,
  answerInvalidationVerdictSchema,
} from './schema.js';
export type {
  AnswerInvalidationInput,
  AnswerInvalidationResult,
  AnswerInvalidationVerdict,
} from './schema.js';
