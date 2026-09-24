import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const soundMatchVerdictSchema = z.enum(['matches', 'mismatched']);
export const soundMatchInputSchema = z.object({
  request: nonEmptyText,
  patch: nonEmptyText,
  minConfidence: probability.optional(),
});
export const soundMatchResultSchema = gateResultSchema.extend({ verdict: soundMatchVerdictSchema });

export type SoundMatchVerdict = z.infer<typeof soundMatchVerdictSchema>;
export type SoundMatchInput = z.infer<typeof soundMatchInputSchema>;
export type SoundMatchResult = z.infer<typeof soundMatchResultSchema>;
