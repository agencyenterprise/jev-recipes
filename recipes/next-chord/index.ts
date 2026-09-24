import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { nextChordInputSchema } from './schema.js';
import type { NextChordInput, NextChordResult } from './schema.js';

export async function nextChord(
  input: NextChordInput,
  options: RecipeOptions = {},
): Promise<NextChordResult> {
  const { minConfidence = 0.8, ...state } = nextChordInputSchema.parse(input);
  return selectCandidate(
    state,
    state.candidates,
    'Which candidate in candidates best continues progression, given key and style when they are supplied? Judge the harmonic function the last chord of progression sets up, whether each candidate resolves, prolongs, or sidesteps that expectation, and which move a listener in the stated style would find most convincing at this point. Choose none when holding the current chord or resting is the most musical continuation. Choose ambiguous when several candidates fit equally well. Do not compute key membership or voice leading; judge the harmonic sense of what is described.',
    minConfidence,
    options,
  );
}

export { nextChordInputSchema, nextChordResultSchema } from './schema.js';
export type { NextChordInput, NextChordResult } from './schema.js';
