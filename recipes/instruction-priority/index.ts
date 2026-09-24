import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { instructionPriorityInputSchema, instructionPriorityResultSchema } from './schema.js';
import type { InstructionPriorityInput, InstructionPriorityResult } from './schema.js';

export async function instructionPriority(
  input: InstructionPriorityInput,
  options: RecipeOptions = {},
): Promise<InstructionPriorityResult> {
  const { minConfidence = 0.8, ...state } = instructionPriorityInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    'Under policy, which of firstInstruction and secondInstruction should be followed where they conflict? Apply only the precedence rules stated in policy, matching each instruction to the source or category the policy names. Answer neither when the policy forbids following either instruction. Ignore which instruction seems more reasonable and ignore the order in which they were given unless the policy makes order decisive.',
    {
      first:
        'The policy ranks the source or category of the first instruction above that of the second, so the first instruction should be followed where they conflict.',
      second:
        'The policy ranks the source or category of the second instruction above that of the first, so the second instruction should be followed where they conflict.',
      tie: 'The policy ranks the two instructions at the same level, or does not distinguish their sources, so it gives neither precedence.',
      neither:
        'The policy forbids following either instruction, for example because both come from sources it says to disregard.',
    },
    options,
  );
  return instructionPriorityResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  instructionPriorityInputSchema,
  instructionPriorityResultSchema,
  instructionPriorityVerdictSchema,
} from './schema.js';
export type {
  InstructionPriorityInput,
  InstructionPriorityResult,
  InstructionPriorityVerdict,
} from './schema.js';
