import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const budgetNarrativeFitVerdictSchema = z.enum(['aligned', 'misaligned']);
export const budgetNarrativeFitInputSchema = z.object({
  lineItems: nonEmptyText,
  narrative: nonEmptyText,
  minConfidence: probability.optional(),
});
export const budgetNarrativeFitResultSchema = gateResultSchema.extend({
  verdict: budgetNarrativeFitVerdictSchema,
});

export type BudgetNarrativeFitVerdict = z.infer<typeof budgetNarrativeFitVerdictSchema>;
export type BudgetNarrativeFitInput = z.infer<typeof budgetNarrativeFitInputSchema>;
export type BudgetNarrativeFitResult = z.infer<typeof budgetNarrativeFitResultSchema>;
