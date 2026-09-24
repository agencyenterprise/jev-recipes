import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { retryWorthwhileInputSchema, retryWorthwhileResultSchema } from './schema.js';
import type { RetryWorthwhileInput, RetryWorthwhileResult } from './schema.js';

export async function retryWorthwhile(
  input: RetryWorthwhileInput,
  options: RecipeOptions = {},
): Promise<RetryWorthwhileResult> {
  const { minConfidence = 0.8, ...state } = retryWorthwhileInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does failure describe a transient condition where repeating the identical attempt could succeed? Transient conditions include timeouts, rate limits, temporary unavailability, lock contention, and interrupted connections. Deterministic failures include invalid input, permission denied, resources that do not exist, and logic errors, which recur unchanged on retry. Use attempt, when supplied, for how many times and how recently the same action has already been tried; repeated identical failures make a further retry less worthwhile.',
    {
      true: 'The failure is transient and an identical retry could succeed.',
      false: 'The failure is deterministic and an identical retry would fail the same way.',
    },
    options,
  );
  return retryWorthwhileResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'retry' : 'stop',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  retryWorthwhileInputSchema,
  retryWorthwhileResultSchema,
  retryWorthwhileVerdictSchema,
} from './schema.js';
export type {
  RetryWorthwhileInput,
  RetryWorthwhileResult,
  RetryWorthwhileVerdict,
} from './schema.js';
