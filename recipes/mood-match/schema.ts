import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const moodMatchVerdictSchema = z.enum(['matches', 'mismatched']);
export const moodMatchInputSchema = z.object({
  requestedMood: nonEmptyText,
  passage: nonEmptyText,
  minConfidence: probability.optional(),
});
export const moodMatchResultSchema = gateResultSchema.extend({ verdict: moodMatchVerdictSchema });

export type MoodMatchVerdict = z.infer<typeof moodMatchVerdictSchema>;
export type MoodMatchInput = z.infer<typeof moodMatchInputSchema>;
export type MoodMatchResult = z.infer<typeof moodMatchResultSchema>;
