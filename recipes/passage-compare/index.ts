import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { passageCompareInputSchema, passageCompareResultSchema } from './schema.js';
import type { PassageCompareInput, PassageCompareResult } from './schema.js';

export async function passageCompare(
  input: PassageCompareInput,
  options: RecipeOptions = {},
): Promise<PassageCompareResult> {
  const { minConfidence = 0.8, ...state } = passageCompareInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    'Which passage more directly and completely helps answer question? Judge the information each passage contains, not its length or style.',
    {
      first: 'Only the first passage helps answer the question, or it clearly helps more.',
      second: 'Only the second passage helps answer the question, or it clearly helps more.',
      tie: 'Both passages help answer the question about equally.',
      neither: 'Neither passage contains information that helps answer the question.',
    },
    options,
  );
  return passageCompareResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  passageCompareInputSchema,
  passageCompareResultSchema,
  passageCompareVerdictSchema,
} from './schema.js';
export type { PassageCompareInput, PassageCompareResult, PassageCompareVerdict } from './schema.js';
