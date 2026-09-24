import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const ruleComplianceVerdictSchema = z.enum(['legal', 'illegal']);
export const ruleComplianceInputSchema = z.object({
  action: nonEmptyText,
  rules: nonEmptyText,
  minConfidence: probability.optional(),
});
export const ruleComplianceResultSchema = gateResultSchema.extend({
  verdict: ruleComplianceVerdictSchema,
});

export type RuleComplianceVerdict = z.infer<typeof ruleComplianceVerdictSchema>;
export type RuleComplianceInput = z.infer<typeof ruleComplianceInputSchema>;
export type RuleComplianceResult = z.infer<typeof ruleComplianceResultSchema>;
