import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const budgetFitVerdictSchema = z.enum(['fits', 'exceeds']);

export const budgetFitInputSchema = z.object({
  plan: nonEmptyText,
  budget: nonEmptyText,
  minConfidence: probability.optional(),
});

export const budgetFitResultSchema = gateResultSchema.extend({
  verdict: budgetFitVerdictSchema,
});

export type BudgetFitVerdict = z.infer<typeof budgetFitVerdictSchema>;
export type BudgetFitInput = z.infer<typeof budgetFitInputSchema>;
export type BudgetFitResult = z.infer<typeof budgetFitResultSchema>;
