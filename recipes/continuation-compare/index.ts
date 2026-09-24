import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { continuationCompareInputSchema, continuationCompareResultSchema } from './schema.js';
import type { ContinuationCompareInput, ContinuationCompareResult } from './schema.js';

export async function continuationCompare(
  input: ContinuationCompareInput,
  options: RecipeOptions = {},
): Promise<ContinuationCompareResult> {
  const { minConfidence = 0.8, ...state } = continuationCompareInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    'Which of firstContinuation and secondContinuation better follows the musical context, given style when it is supplied? Judge how well each keeps or develops the motif in context, how naturally its contour follows the line, how its harmony fits what came before, and how well it matches the stated style. Prefer the continuation a listener would hear as belonging to the same piece. Answer tie when both follow about equally well and neither when both break with the context. Do not compute key membership, intervals, or beat counts; judge the musical sense of what is described.',
    {
      first:
        'Only the first continuation keeps or develops the motif, contour, harmony, and style of the context, or it does so clearly better than the second.',
      second:
        'Only the second continuation keeps or develops the motif, contour, harmony, and style of the context, or it does so clearly better than the first.',
      tie: 'Both continuations follow the context about equally well.',
      neither:
        'Neither continuation follows the context; both break with its motif, contour, harmony, or style.',
    },
    options,
  );
  return continuationCompareResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  continuationCompareInputSchema,
  continuationCompareResultSchema,
  continuationCompareVerdictSchema,
} from './schema.js';
export type {
  ContinuationCompareInput,
  ContinuationCompareResult,
  ContinuationCompareVerdict,
} from './schema.js';
