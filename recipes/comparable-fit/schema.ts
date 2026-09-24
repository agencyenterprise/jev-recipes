import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const comparableFitVerdictSchema = z.enum(['comparable', 'dissimilar']);
export const comparableFitInputSchema = z.object({
  subject: nonEmptyText,
  comparable: nonEmptyText,
  minConfidence: probability.optional(),
});
export const comparableFitResultSchema = gateResultSchema.extend({
  verdict: comparableFitVerdictSchema,
});

export type ComparableFitVerdict = z.infer<typeof comparableFitVerdictSchema>;
export type ComparableFitInput = z.infer<typeof comparableFitInputSchema>;
export type ComparableFitResult = z.infer<typeof comparableFitResultSchema>;
