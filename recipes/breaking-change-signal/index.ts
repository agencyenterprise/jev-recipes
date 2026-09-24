import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { breakingChangeSignalInputSchema, breakingChangeSignalResultSchema } from './schema.js';
import type { BreakingChangeSignalInput, BreakingChangeSignalResult } from './schema.js';

export async function breakingChangeSignal(
  input: BreakingChangeSignalInput,
  options: RecipeOptions = {},
): Promise<BreakingChangeSignalResult> {
  const { minConfidence = 0.8, ...state } = breakingChangeSignalInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does change describe a change that would break existing callers, integrations, stored data, or documented behavior, given any context? Count removed or renamed public fields, functions, endpoints, or options; changed types, defaults, or return shapes; stricter validation; and incompatible data or schema changes. Purely additive changes, internal refactors, and bug fixes that restore documented behavior do not count.',
    {
      true: 'The change would break existing callers, integrations, stored data, or documented behavior.',
      false:
        'The change preserves existing callers, integrations, stored data, and documented behavior.',
    },
    options,
  );
  return breakingChangeSignalResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'breaking' : 'compatible',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  breakingChangeSignalInputSchema,
  breakingChangeSignalResultSchema,
  breakingChangeSignalVerdictSchema,
} from './schema.js';
export type {
  BreakingChangeSignalInput,
  BreakingChangeSignalResult,
  BreakingChangeSignalVerdict,
} from './schema.js';
