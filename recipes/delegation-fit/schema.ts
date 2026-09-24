import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const delegationFitVerdictSchema = z.enum(['fits', 'outside']);

export const delegationFitInputSchema = z.object({
  subtask: nonEmptyText,
  capabilities: nonEmptyText,
  minConfidence: probability.optional(),
});

export const delegationFitResultSchema = gateResultSchema.extend({
  verdict: delegationFitVerdictSchema,
});

export type DelegationFitVerdict = z.infer<typeof delegationFitVerdictSchema>;
export type DelegationFitInput = z.infer<typeof delegationFitInputSchema>;
export type DelegationFitResult = z.infer<typeof delegationFitResultSchema>;
