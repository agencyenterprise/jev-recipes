import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { moodMatchInputSchema, moodMatchResultSchema } from './schema.js';
import type { MoodMatchInput, MoodMatchResult } from './schema.js';

export async function moodMatch(
  input: MoodMatchInput,
  options: RecipeOptions = {},
): Promise<MoodMatchResult> {
  const { minConfidence = 0.8, ...state } = moodMatchInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Read requestedMood, the mood a listener asked for, and passage, a text description of a musical passage. Decide whether the musical features described in passage, such as mode, tempo, register, harmony, rhythm, and dynamics, conventionally express requestedMood. Judge the features against the mood as worded, allowing for synonyms and near neighbours, such as soothing for calm. Ignore any listener reaction, title, or intention that passage mentions, and do not judge whether the passage is well played or interesting.',
    {
      true: 'The features passage describes conventionally express requestedMood or a close neighbour of it, with no dominant feature pulling toward an opposing mood.',
      false:
        'The features passage describes express a different mood from requestedMood, or the features that support requestedMood are outweighed by ones that oppose it.',
    },
    options,
  );
  return moodMatchResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'matches' : 'mismatched',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export { moodMatchInputSchema, moodMatchResultSchema, moodMatchVerdictSchema } from './schema.js';
export type { MoodMatchInput, MoodMatchResult, MoodMatchVerdict } from './schema.js';
