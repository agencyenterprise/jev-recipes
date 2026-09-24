import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { stepCompleteInputSchema, stepCompleteResultSchema } from './schema.js';
import type { StepCompleteInput, StepCompleteResult } from './schema.js';

export async function stepComplete(
  input: StepCompleteInput,
  options: RecipeOptions = {},
): Promise<StepCompleteResult> {
  const { minConfidence = 0.8, ...state } = stepCompleteInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does evidence establish that condition has been met? A plan, attempted action, or unsupported assertion of completion is not enough unless the condition specifically concerns that report.',
    {
      met: 'The evidence establishes the full condition is satisfied.',
      unmet:
        'The evidence affirmatively shows the condition failed or has not happened; mere absence of confirmation is not enough.',
      unclear:
        'The evidence does not say whether the condition is satisfied, including when the outcome is simply unconfirmed.',
    },
    options,
  );
  return stepCompleteResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  stepCompleteInputSchema,
  stepCompleteResultSchema,
  stepCompleteVerdictSchema,
} from './schema.js';
export type { StepCompleteInput, StepCompleteResult, StepCompleteVerdict } from './schema.js';
