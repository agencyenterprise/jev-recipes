import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { nextNoteInputSchema } from './schema.js';
import type { NextNoteInput, NextNoteResult } from './schema.js';

export async function nextNote(
  input: NextNoteInput,
  options: RecipeOptions = {},
): Promise<NextNoteResult> {
  const { minConfidence = 0.8, ...state } = nextNoteInputSchema.parse(input);
  return selectCandidate(
    state,
    state.candidates,
    'Which candidate in candidates best continues the melody in recentNotes, given key and style when they are supplied? Judge the contour of recentNotes, the size of the interval each candidate would create, whether it extends or answers the motif, and where the phrase seems to be heading, and prefer the candidate a listener in the stated style would find most natural. Choose none when a rest or silence would be the most musical continuation. Choose ambiguous when several candidates fit equally well. Do not compute scale membership or interval arithmetic; judge the musical sense of what is described.',
    minConfidence,
    options,
  );
}

export { nextNoteInputSchema, nextNoteResultSchema } from './schema.js';
export type { NextNoteInput, NextNoteResult } from './schema.js';
