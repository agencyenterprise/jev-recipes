import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  instructionClarityInputSchema,
  instructionClarityResultSchema,
  instructionClarityVerdictSchema,
} from './schema.js';
import type { InstructionClarityInput, InstructionClarityResult } from './schema.js';

export async function instructionClarity(
  input: InstructionClarityInput,
  options: RecipeOptions = {},
): Promise<InstructionClarityResult> {
  const { minConfidence = 0.8, ...state } = instructionClarityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How unambiguous is instruction for a delegate who has only context and no other knowledge of the situation? Judge whether the delegate could identify exactly what to do, on what, and how to tell when it is done, without asking. Terms, references, and defaults that context resolves count as clear; anything the delegate would have to guess counts as ambiguous. Ignore politeness and length.',
    [
      'The delegate cannot act at all without asking what is meant.',
      'Several plausible readings lead to materially different work, and nothing in context selects one.',
      'One reading is clearly most likely, but notable gaps such as scope, target, or format are left to the delegate.',
      'The intended work is clear, with only minor ambiguity that would not change the outcome.',
      'The instruction is unambiguous and complete, leaving nothing for the delegate to guess.',
    ],
    options,
  );
  return instructionClarityResultSchema.parse({
    ...decision,
    clarity: instructionClarityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  instructionClarityInputSchema,
  instructionClarityResultSchema,
  instructionClarityVerdictSchema,
} from './schema.js';
export type {
  InstructionClarityInput,
  InstructionClarityResult,
  InstructionClarityVerdict,
} from './schema.js';
