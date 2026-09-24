import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const reconciliationMatchVerdictSchema = z.enum(['same', 'different']);
export const reconciliationMatchInputSchema = z.object({
  record: nonEmptyText,
  statementLine: nonEmptyText,
  minConfidence: probability.optional(),
});
export const reconciliationMatchResultSchema = gateResultSchema.extend({
  verdict: reconciliationMatchVerdictSchema,
});

export type ReconciliationMatchVerdict = z.infer<typeof reconciliationMatchVerdictSchema>;
export type ReconciliationMatchInput = z.infer<typeof reconciliationMatchInputSchema>;
export type ReconciliationMatchResult = z.infer<typeof reconciliationMatchResultSchema>;
