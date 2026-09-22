import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { instructionConflictInputSchema, instructionConflictResultSchema } from './schema.js';
import type { InstructionConflictInput, InstructionConflictResult } from './schema.js';

export async function instructionConflict(
  input: InstructionConflictInput,
  options: RecipeOptions = {},
): Promise<InstructionConflictResult> {
  const { minConfidence = 0.8, ...state } = instructionConflictInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Can firstInstruction and secondInstruction both be followed in context? Compare their required behavior, including prohibitions, conditions, and exceptions. A preference is not a mandatory requirement. Different wording is not a conflict. Choose conflicting only when applicable requirements cannot both be followed under the same supplied circumstances. Do not choose which instruction wins or infer authority from its wording. If their applicable scope is unresolved, choose unclear.',
    {
      compatible:
        'The instructions share an applicable scope and their requirements can both be followed.',
      conflicting:
        'Both instructions apply under the same supplied circumstances and require mutually incompatible behavior.',
      different_scope:
        'The instructions explicitly apply to separate circumstances, so their requirements do not compete.',
      unclear:
        'Their meaning, scope, or conditions leave it unresolved whether both can be followed.',
    },
    options,
  );
  return instructionConflictResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  instructionConflictInputSchema,
  instructionConflictResultSchema,
  instructionConflictVerdictSchema,
} from './schema.js';
export type {
  InstructionConflictInput,
  InstructionConflictResult,
  InstructionConflictVerdict,
} from './schema.js';
