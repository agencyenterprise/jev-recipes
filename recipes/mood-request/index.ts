import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { moodRequestInputSchema, moodRequestResultSchema } from './schema.js';
import type { MoodRequestInput, MoodRequestResult } from './schema.js';

export async function moodRequest(
  input: MoodRequestInput,
  options: RecipeOptions = {},
): Promise<MoodRequestResult> {
  const { minConfidence = 0.8, ...state } = moodRequestInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read message from a listener of a musical performance and decide which mood it asks the music to take on. Judge the feeling the listener wants to hear, not the feeling the listener expresses about themselves; a listener who says they are stressed and wants something to unwind to is asking for calm. Pick the single mood the message presses most. If message asks for a tempo, style, or piece without naming a feeling, or asks nothing of the music, choose unclear.',
    {
      happy: 'The message asks for something cheerful, bright, upbeat in feeling, or fun.',
      sad: 'The message asks for something melancholy, mournful, wistful, or heartbreaking.',
      calm: 'The message asks for something relaxing, soft, peaceful, dreamy, or soothing.',
      energetic: 'The message asks for something lively, intense, driving, exciting, or hype.',
      tense: 'The message asks for something suspenseful, dark, eerie, anxious, or dramatic.',
      romantic: 'The message asks for something loving, tender, intimate, or sensual.',
      unclear:
        'The message names no feeling it wants to hear, or names one that fits none of the listed moods.',
    },
    options,
  );
  return moodRequestResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  moodRequestInputSchema,
  moodRequestResultSchema,
  moodRequestVerdictSchema,
} from './schema.js';
export type { MoodRequestInput, MoodRequestResult, MoodRequestVerdict } from './schema.js';
