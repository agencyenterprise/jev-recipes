import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { nextDurationInputSchema } from './schema.js';
import type { NextDurationInput, NextDurationResult } from './schema.js';

export async function nextDuration(
  input: NextDurationInput,
  options: RecipeOptions = {},
): Promise<NextDurationResult> {
  const { minConfidence = 0.8, ...state } = nextDurationInputSchema.parse(input);
  return selectCandidate(
    state,
    state.candidates,
    'Which candidate in candidates best continues recentRhythm within meter, given style when it is supplied? Judge the pulse and subdivision recentRhythm has established, whether each candidate keeps, completes, or breaks that pattern, and which choice a listener in the stated style would find most natural at this point in the bar. Choose none when a rest is the most musical continuation. Choose ambiguous when several candidates fit equally well. Do not add up beats or check bar arithmetic; judge the rhythmic sense of what is described.',
    minConfidence,
    options,
  );
}

export { nextDurationInputSchema, nextDurationResultSchema } from './schema.js';
export type { NextDurationInput, NextDurationResult } from './schema.js';
