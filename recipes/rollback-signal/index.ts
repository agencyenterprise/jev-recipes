import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { rollbackSignalInputSchema, rollbackSignalResultSchema } from './schema.js';
import type { RollbackSignalInput, RollbackSignalResult } from './schema.js';

export async function rollbackSignal(
  input: RollbackSignalInput,
  options: RecipeOptions = {},
): Promise<RollbackSignalResult> {
  const { minConfidence = 0.8, ...state } = rollbackSignalInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Do symptoms plausibly point at change as the cause? Answer yes only when the onset described in symptoms follows the deploy described in change and the affected functionality overlaps the code, service, or configuration the change touched. Judge only the timing and scope stated in the two texts. Ignore how risky the change sounds in general, and do not assume a cause the texts do not describe.',
    {
      true: 'The onset in symptoms follows the deploy in change, and the failing functionality overlaps the area the change touched.',
      false:
        'The symptoms began before the change, affect an area the change did not touch, or describe a failure mode the change could not plausibly produce.',
    },
    options,
  );
  return rollbackSignalResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'implicated' : 'unrelated',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  rollbackSignalInputSchema,
  rollbackSignalResultSchema,
  rollbackSignalVerdictSchema,
} from './schema.js';
export type { RollbackSignalInput, RollbackSignalResult, RollbackSignalVerdict } from './schema.js';
