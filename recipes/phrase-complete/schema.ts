import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const phraseCompleteVerdictSchema = z.enum(['complete', 'open']);
export const phraseCompleteInputSchema = z.object({
  recentNotes: nonEmptyText,
  meter: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const phraseCompleteResultSchema = gateResultSchema.extend({
  verdict: phraseCompleteVerdictSchema,
});

export type PhraseCompleteVerdict = z.infer<typeof phraseCompleteVerdictSchema>;
export type PhraseCompleteInput = z.infer<typeof phraseCompleteInputSchema>;
export type PhraseCompleteResult = z.infer<typeof phraseCompleteResultSchema>;
