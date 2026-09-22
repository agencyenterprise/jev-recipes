import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { stepProgressInputSchema, stepProgressResultSchema } from './schema.js';
import type { StepProgressInput, StepProgressResult } from './schema.js';

export async function stepProgress(
  input: StepProgressInput,
  options: RecipeOptions = {},
): Promise<StepProgressResult> {
  const { minConfidence = 0.8, ...state } = stepProgressInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How does observation change progress toward objective relative to previousState? Base the decision on observed information or achieved conditions, not an unsupported claim of progress.',
    {
      progress:
        'The observation establishes a useful new fact or achieved condition toward the objective.',
      no_progress: 'The observation leaves the relevant state essentially unchanged.',
      setback:
        'The observation establishes loss of previously achieved progress or a worsened relevant state.',
      unclear: 'The change in progress cannot be determined.',
    },
    options,
  );
  return stepProgressResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  stepProgressInputSchema,
  stepProgressResultSchema,
  stepProgressVerdictSchema,
} from './schema.js';
export type { StepProgressInput, StepProgressResult, StepProgressVerdict } from './schema.js';
