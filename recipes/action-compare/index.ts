import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { actionCompareInputSchema, actionCompareResultSchema } from './schema.js';
import type { ActionCompareInput, ActionCompareResult } from './schema.js';

export async function actionCompare(
  input: ActionCompareInput,
  options: RecipeOptions = {},
): Promise<ActionCompareResult> {
  const { minConfidence = 0.8, ...state } = actionCompareInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    'Which action better advances goal while respecting any constraints? Judge expected progress toward the goal and compliance with the constraints, not effort or wording.',
    {
      first:
        'Only the first action advances the goal within the constraints, or it clearly does so better.',
      second:
        'Only the second action advances the goal within the constraints, or it clearly does so better.',
      tie: 'Both actions advance the goal within the constraints about equally.',
      neither: 'Neither action advances the goal within the constraints.',
    },
    options,
  );
  return actionCompareResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  actionCompareInputSchema,
  actionCompareResultSchema,
  actionCompareVerdictSchema,
} from './schema.js';
export type { ActionCompareInput, ActionCompareResult, ActionCompareVerdict } from './schema.js';
