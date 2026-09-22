import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { confirmationMatchInputSchema, confirmationMatchResultSchema } from './schema.js';
import type { ConfirmationMatchInput, ConfirmationMatchResult } from './schema.js';

export async function confirmationMatch(
  input: ConfirmationMatchInput,
  options: RecipeOptions = {},
): Promise<ConfirmationMatchResult> {
  const { minConfidence = 0.8, ...state } = confirmationMatchInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does response clearly agree to or reject this exact proposal? Do not treat politeness, acknowledgment, a question, or agreement to only part of the proposal as full agreement.',
    {
      agrees: 'The response clearly agrees to this complete proposal.',
      rejects: 'The response clearly rejects this proposal.',
      unclear:
        'The response is conditional, partial, ambiguous, unrelated, or only an acknowledgment.',
    },
    options,
  );
  return confirmationMatchResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  confirmationMatchInputSchema,
  confirmationMatchResultSchema,
  confirmationMatchVerdictSchema,
} from './schema.js';
export type {
  ConfirmationMatchInput,
  ConfirmationMatchResult,
  ConfirmationMatchVerdict,
} from './schema.js';
