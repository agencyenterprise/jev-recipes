import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const categoryFitVerdictSchema = z.enum(['fits', 'misfiled']);

export const categoryFitInputSchema = z.object({
  item: nonEmptyText,
  category: nonEmptyText,
  minConfidence: probability.optional(),
});

export const categoryFitResultSchema = gateResultSchema.extend({
  verdict: categoryFitVerdictSchema,
});

export type CategoryFitVerdict = z.infer<typeof categoryFitVerdictSchema>;
export type CategoryFitInput = z.infer<typeof categoryFitInputSchema>;
export type CategoryFitResult = z.infer<typeof categoryFitResultSchema>;
