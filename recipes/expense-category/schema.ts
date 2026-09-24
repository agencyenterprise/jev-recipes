import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const expenseCategoryVerdictSchema = z.enum(['matched', 'multiple', 'none', 'unclear']);
export const expenseCategoryInputSchema = z.object({
  expense: nonEmptyText,
  categories: nonEmptyText,
  minConfidence: probability.optional(),
});
export const expenseCategoryResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: expenseCategoryVerdictSchema,
  confidence: probability,
  probabilities: z.record(expenseCategoryVerdictSchema, probability),
});

export type ExpenseCategoryVerdict = z.infer<typeof expenseCategoryVerdictSchema>;
export type ExpenseCategoryInput = z.infer<typeof expenseCategoryInputSchema>;
export type ExpenseCategoryResult = z.infer<typeof expenseCategoryResultSchema>;
