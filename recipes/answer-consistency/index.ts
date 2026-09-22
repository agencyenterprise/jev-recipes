import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { answerConsistencyInputSchema, answerConsistencyResultSchema } from './schema.js';
import type { AnswerConsistencyInput, AnswerConsistencyResult } from './schema.js';

export async function answerConsistency(
  input: AnswerConsistencyInput,
  options: RecipeOptions = {},
): Promise<AnswerConsistencyResult> {
  const { minConfidence = 0.8, ...state } = answerConsistencyInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do firstStatement and secondStatement make compatible claims about the same subject and circumstances? Distinguish different conditions from a contradiction.',
    {
      consistent:
        'Both statements concern the same subject and can hold under the supplied circumstances.',
      conflicting:
        'The statements concern the same circumstances and make mutually incompatible claims.',
      unrelated: 'The statements concern different subjects or scopes that should not be compared.',
      unclear: 'The supplied circumstances do not resolve whether the statements conflict.',
    },
    options,
  );
  return answerConsistencyResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  answerConsistencyInputSchema,
  answerConsistencyResultSchema,
  answerConsistencyVerdictSchema,
} from './schema.js';
export type {
  AnswerConsistencyInput,
  AnswerConsistencyResult,
  AnswerConsistencyVerdict,
} from './schema.js';
