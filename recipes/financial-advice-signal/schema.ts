import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const financialAdviceSignalVerdictSchema = z.enum(['advice', 'informational']);
export const financialAdviceSignalInputSchema = z.object({
  text: nonEmptyText,
  minConfidence: probability.optional(),
});
export const financialAdviceSignalResultSchema = gateResultSchema.extend({
  verdict: financialAdviceSignalVerdictSchema,
});

export type FinancialAdviceSignalVerdict = z.infer<typeof financialAdviceSignalVerdictSchema>;
export type FinancialAdviceSignalInput = z.infer<typeof financialAdviceSignalInputSchema>;
export type FinancialAdviceSignalResult = z.infer<typeof financialAdviceSignalResultSchema>;
