import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const noveltyClaimLevelVerdictSchema = z.enum([
  'none',
  'incremental',
  'notable',
  'substantial',
  'unprecedented',
]);
export const noveltyClaimLevelInputSchema = z.object({
  statement: nonEmptyText,
  minConfidence: probability.optional(),
});
export const noveltyClaimLevelResultSchema = scoreResultSchema.extend({
  novelty: noveltyClaimLevelVerdictSchema,
});

export type NoveltyClaimLevelVerdict = z.infer<typeof noveltyClaimLevelVerdictSchema>;
export type NoveltyClaimLevelInput = z.infer<typeof noveltyClaimLevelInputSchema>;
export type NoveltyClaimLevelResult = z.infer<typeof noveltyClaimLevelResultSchema>;
