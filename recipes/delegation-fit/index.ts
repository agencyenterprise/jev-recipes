import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { delegationFitInputSchema, delegationFitResultSchema } from './schema.js';
import type { DelegationFitInput, DelegationFitResult } from './schema.js';

export async function delegationFit(
  input: DelegationFitInput,
  options: RecipeOptions = {},
): Promise<DelegationFitResult> {
  const { minConfidence = 0.8, ...state } = delegationFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does subtask fall within capabilities, the description of what the delegate can do, may access, and is allowed to decide? Count subtask as fitting only when every part of it can be completed using the tools, access, skills, and permissions capabilities describes. A subtask that needs even one tool, data source, or permission capabilities does not mention is outside. Do not assume capabilities beyond what is written.',
    {
      true: 'Every part of the subtask can be completed with the described capabilities.',
      false:
        'Some part of the subtask needs a tool, access, skill, or permission the capabilities do not include.',
    },
    options,
  );
  return delegationFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'fits' : 'outside',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  delegationFitInputSchema,
  delegationFitResultSchema,
  delegationFitVerdictSchema,
} from './schema.js';
export type { DelegationFitInput, DelegationFitResult, DelegationFitVerdict } from './schema.js';
