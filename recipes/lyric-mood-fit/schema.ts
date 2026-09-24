import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const lyricMoodFitVerdictSchema = z.enum(['fits', 'clashes']);
export const lyricMoodFitInputSchema = z.object({
  lyrics: nonEmptyText,
  music: nonEmptyText,
  minConfidence: probability.optional(),
});
export const lyricMoodFitResultSchema = gateResultSchema.extend({
  verdict: lyricMoodFitVerdictSchema,
});

export type LyricMoodFitVerdict = z.infer<typeof lyricMoodFitVerdictSchema>;
export type LyricMoodFitInput = z.infer<typeof lyricMoodFitInputSchema>;
export type LyricMoodFitResult = z.infer<typeof lyricMoodFitResultSchema>;
