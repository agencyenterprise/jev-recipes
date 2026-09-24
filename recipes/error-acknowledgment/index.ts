import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { errorAcknowledgmentInputSchema, errorAcknowledgmentResultSchema } from './schema.js';
import type { ErrorAcknowledgmentInput, ErrorAcknowledgmentResult } from './schema.js';

export async function errorAcknowledgment(
  input: ErrorAcknowledgmentInput,
  options: RecipeOptions = {},
): Promise<ErrorAcknowledgmentResult> {
  const { minConfidence = 0.8, ...state } = errorAcknowledgmentInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does message explicitly acknowledge an earlier mistake and state what the corrected position or action is? Answer yes only when the text of message both names something earlier as wrong, mistaken, or incorrect and states the correction. Use context only to understand what the earlier statement was. A message that gives a new answer without saying the old one was wrong, or that apologizes without stating a correction, does not count. Ignore tone, length, and whether the correction itself is accurate.',
    {
      true: 'The message names an earlier statement or action as wrong and states the corrected position or action.',
      false:
        'The message changes course without saying anything was wrong, ignores the earlier mistake, or expresses regret without stating a correction.',
    },
    options,
  );
  return errorAcknowledgmentResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'acknowledged' : 'absent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  errorAcknowledgmentInputSchema,
  errorAcknowledgmentResultSchema,
  errorAcknowledgmentVerdictSchema,
} from './schema.js';
export type {
  ErrorAcknowledgmentInput,
  ErrorAcknowledgmentResult,
  ErrorAcknowledgmentVerdict,
} from './schema.js';
