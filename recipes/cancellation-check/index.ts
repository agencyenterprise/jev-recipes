import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { cancellationCheckInputSchema, cancellationCheckResultSchema } from './schema.js';
import type { CancellationCheckInput, CancellationCheckResult } from './schema.js';

export async function cancellationCheck(
  input: CancellationCheckInput,
  options: RecipeOptions = {},
): Promise<CancellationCheckResult> {
  const { minConfidence = 0.8, ...state } = cancellationCheckInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does message ask to cancel, pause, or continue task? Resolve which task the instruction concerns. Pausing means stop temporarily; cancellation abandons the task.',
    {
      cancel: 'The message clearly asks to abandon this task.',
      pause: 'The message clearly asks to suspend this task temporarily.',
      continue: 'The message clearly asks to proceed with this task.',
      unclear: 'The message does not clearly establish one of these instructions for this task.',
    },
    options,
  );
  return cancellationCheckResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  cancellationCheckInputSchema,
  cancellationCheckResultSchema,
  cancellationCheckVerdictSchema,
} from './schema.js';
export type {
  CancellationCheckInput,
  CancellationCheckResult,
  CancellationCheckVerdict,
} from './schema.js';
