import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { lyricMoodFitInputSchema, lyricMoodFitResultSchema } from './schema.js';
import type { LyricMoodFitInput, LyricMoodFitResult } from './schema.js';

export async function lyricMoodFit(
  input: LyricMoodFitInput,
  options: RecipeOptions = {},
): Promise<LyricMoodFitResult> {
  const { minConfidence = 0.8, ...state } = lyricMoodFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Do lyrics fit the mood and pacing of the music described in music? Compare the emotional tone, energy, imagery, and density of the words in lyrics against the mood, tempo, genre, and intended use that music describes. Deliberate contrast counts as a fit only when music says the contrast is intended. Do not judge rhyme, meter, syllable counts, or how good the lyrics are.',
    {
      true: 'The emotional tone, energy, and pacing of lyrics agree with the mood, tempo, and purpose described in music, or contrast with them in a way music says is intended.',
      false:
        'The emotional tone, energy, or pacing of lyrics conflicts with the mood, tempo, or purpose described in music, and music does not call for that contrast.',
    },
    options,
  );
  return lyricMoodFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'fits' : 'clashes',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  lyricMoodFitInputSchema,
  lyricMoodFitResultSchema,
  lyricMoodFitVerdictSchema,
} from './schema.js';
export type { LyricMoodFitInput, LyricMoodFitResult, LyricMoodFitVerdict } from './schema.js';
