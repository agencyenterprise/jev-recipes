import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const rollbackSignalVerdictSchema = z.enum(['implicated', 'unrelated']);
export const rollbackSignalInputSchema = z.object({
  symptoms: nonEmptyText,
  change: nonEmptyText,
  minConfidence: probability.optional(),
});
export const rollbackSignalResultSchema = gateResultSchema.extend({
  verdict: rollbackSignalVerdictSchema,
});

export type RollbackSignalVerdict = z.infer<typeof rollbackSignalVerdictSchema>;
export type RollbackSignalInput = z.infer<typeof rollbackSignalInputSchema>;
export type RollbackSignalResult = z.infer<typeof rollbackSignalResultSchema>;
