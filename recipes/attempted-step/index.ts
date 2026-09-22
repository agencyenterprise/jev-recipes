import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { attemptedStepInputSchema, attemptedStepResultSchema } from './schema.js';
import type { AttemptedStepInput, AttemptedStepResult } from './schema.js';

export async function attemptedStep(
  input: AttemptedStepInput,
  options: RecipeOptions = {},
): Promise<AttemptedStepResult> {
  const { minConfidence = 0.8, ...state } = attemptedStepInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does conversation establish whether the customer already performed step? Being told to try it, planning to try it, and actually trying it are different. Do not infer not-tried merely from silence.',
    {
      tried:
        'The conversation explicitly states or unambiguously reports that this step was performed.',
      not_tried: 'The conversation explicitly establishes the step has not been performed.',
      unclear: 'There is no reliable statement of whether the step was performed.',
    },
    options,
  );
  return attemptedStepResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  attemptedStepInputSchema,
  attemptedStepResultSchema,
  attemptedStepVerdictSchema,
} from './schema.js';
export type { AttemptedStepInput, AttemptedStepResult, AttemptedStepVerdict } from './schema.js';
