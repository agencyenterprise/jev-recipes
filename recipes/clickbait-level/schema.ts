import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const clickbaitLevelVerdictSchema = z.enum(['none', 'mild', 'moderate', 'heavy', 'extreme']);
export const clickbaitLevelInputSchema = z.object({
  headline: nonEmptyText,
  minConfidence: probability.optional(),
});
export const clickbaitLevelResultSchema = scoreResultSchema.extend({
  bait: clickbaitLevelVerdictSchema,
});

export type ClickbaitLevelVerdict = z.infer<typeof clickbaitLevelVerdictSchema>;
export type ClickbaitLevelInput = z.infer<typeof clickbaitLevelInputSchema>;
export type ClickbaitLevelResult = z.infer<typeof clickbaitLevelResultSchema>;
