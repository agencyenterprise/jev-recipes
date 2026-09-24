import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const medicationMentionVerdictSchema = z.enum(['mentioned', 'absent']);
export const medicationMentionInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const medicationMentionResultSchema = gateResultSchema.extend({
  verdict: medicationMentionVerdictSchema,
});

export type MedicationMentionVerdict = z.infer<typeof medicationMentionVerdictSchema>;
export type MedicationMentionInput = z.infer<typeof medicationMentionInputSchema>;
export type MedicationMentionResult = z.infer<typeof medicationMentionResultSchema>;
