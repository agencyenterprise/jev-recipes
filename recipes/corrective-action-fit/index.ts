import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { correctiveActionFitInputSchema, correctiveActionFitResultSchema } from './schema.js';
import type { CorrectiveActionFitInput, CorrectiveActionFitResult } from './schema.js';

export async function correctiveActionFit(
  input: CorrectiveActionFitInput,
  options: RecipeOptions = {},
): Promise<CorrectiveActionFitResult> {
  const { minConfidence = 0.8, ...state } = correctiveActionFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does action change the condition named in rootCause so that the same cause would no longer produce the defect? Judge only whether the action acts on the stated cause. Reworking, scrapping, or sorting affected items, adding inspection, recalibrating or replacing the failed item once, and reminding or retraining people address the symptom or the instance, not the cause, unless rootCause itself is the absence of that inspection, calibration, or training. Ignore whether rootCause is correct, whether action is feasible, and whether it names an owner or date.',
    {
      true: 'The action changes the process, design, specification, or organizational condition named in rootCause so that the same cause would no longer produce the defect.',
      false:
        'The action fixes the affected items, adds a check, or treats the failed instance while leaving the condition named in rootCause in place.',
    },
    options,
  );
  return correctiveActionFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'addresses' : 'misses',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  correctiveActionFitInputSchema,
  correctiveActionFitResultSchema,
  correctiveActionFitVerdictSchema,
} from './schema.js';
export type {
  CorrectiveActionFitInput,
  CorrectiveActionFitResult,
  CorrectiveActionFitVerdict,
} from './schema.js';
