import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const consentScopeFitVerdictSchema = z.enum(['covered', 'uncovered']);
export const consentScopeFitInputSchema = z.object({
  consent: nonEmptyText,
  use: nonEmptyText,
  minConfidence: probability.optional(),
});
export const consentScopeFitResultSchema = gateResultSchema.extend({
  verdict: consentScopeFitVerdictSchema,
});

export type ConsentScopeFitVerdict = z.infer<typeof consentScopeFitVerdictSchema>;
export type ConsentScopeFitInput = z.infer<typeof consentScopeFitInputSchema>;
export type ConsentScopeFitResult = z.infer<typeof consentScopeFitResultSchema>;
