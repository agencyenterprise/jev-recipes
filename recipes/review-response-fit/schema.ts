import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const reviewResponseFitVerdictSchema = z.enum(['addresses', 'generic']);
export const reviewResponseFitInputSchema = z.object({
  review: nonEmptyText,
  response: nonEmptyText,
  minConfidence: probability.optional(),
});
export const reviewResponseFitResultSchema = gateResultSchema.extend({
  verdict: reviewResponseFitVerdictSchema,
});

export type ReviewResponseFitVerdict = z.infer<typeof reviewResponseFitVerdictSchema>;
export type ReviewResponseFitInput = z.infer<typeof reviewResponseFitInputSchema>;
export type ReviewResponseFitResult = z.infer<typeof reviewResponseFitResultSchema>;
