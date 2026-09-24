import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const policyComplianceVerdictSchema = z.enum(['compliant', 'noncompliant']);
export const policyComplianceInputSchema = z.object({
  expense: nonEmptyText,
  policy: nonEmptyText,
  minConfidence: probability.optional(),
});
export const policyComplianceResultSchema = gateResultSchema.extend({
  verdict: policyComplianceVerdictSchema,
});

export type PolicyComplianceVerdict = z.infer<typeof policyComplianceVerdictSchema>;
export type PolicyComplianceInput = z.infer<typeof policyComplianceInputSchema>;
export type PolicyComplianceResult = z.infer<typeof policyComplianceResultSchema>;
