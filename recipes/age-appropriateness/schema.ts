import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const ageAppropriatenessVerdictSchema = z.enum([
  'everyone',
  'children',
  'teens',
  'mature',
  'adults',
]);

export const ageAppropriatenessInputSchema = z.object({
  content: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const ageAppropriatenessResultSchema = scoreResultSchema.extend({
  rating: ageAppropriatenessVerdictSchema,
});

export type AgeAppropriatenessVerdict = z.infer<typeof ageAppropriatenessVerdictSchema>;
export type AgeAppropriatenessInput = z.infer<typeof ageAppropriatenessInputSchema>;
export type AgeAppropriatenessResult = z.infer<typeof ageAppropriatenessResultSchema>;
