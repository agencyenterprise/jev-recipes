import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  instructionReadabilityInputSchema,
  instructionReadabilityResultSchema,
  instructionReadabilityVerdictSchema,
} from './schema.js';
import type { InstructionReadabilityInput, InstructionReadabilityResult } from './schema.js';

export async function instructionReadability(
  input: InstructionReadabilityInput,
  options: RecipeOptions = {},
): Promise<InstructionReadabilityResult> {
  const { minConfidence = 0.8, ...state } = instructionReadabilityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How easy are instructions to follow for a general reader, or for audience when it is supplied? Judge vocabulary, sentence length, whether the steps are laid out in the order the reader should do them, and whether each step says concretely what to do, how much, and when. Ignore whether the instructions are medically correct, complete, or appropriate for the condition.',
    [
      'Dense clinical jargon and abbreviations in long sentences with no step order; a general reader would need someone to translate it before acting.',
      'Mostly technical terms and abbreviations with a few plain phrases; the reader can guess the gist but not the exact actions.',
      'Plain and technical language are mixed, and the actions can be found but are not clearly ordered or separated into steps.',
      'Plain language with only a few unexplained terms; the actions are stated, but the order, quantity, or timing is not fully spelled out.',
      'Everyday wording, one action per step, in the order the reader should do them, with concrete quantities and timing.',
    ],
    options,
  );
  return instructionReadabilityResultSchema.parse({
    ...decision,
    readability: instructionReadabilityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  instructionReadabilityInputSchema,
  instructionReadabilityResultSchema,
  instructionReadabilityVerdictSchema,
} from './schema.js';
export type {
  InstructionReadabilityInput,
  InstructionReadabilityResult,
  InstructionReadabilityVerdict,
} from './schema.js';
