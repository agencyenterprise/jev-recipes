import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const errorAcknowledgmentVerdictSchema = z.enum(['acknowledged', 'absent']);
export const errorAcknowledgmentInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const errorAcknowledgmentResultSchema = gateResultSchema.extend({
  verdict: errorAcknowledgmentVerdictSchema,
});

export type ErrorAcknowledgmentVerdict = z.infer<typeof errorAcknowledgmentVerdictSchema>;
export type ErrorAcknowledgmentInput = z.infer<typeof errorAcknowledgmentInputSchema>;
export type ErrorAcknowledgmentResult = z.infer<typeof errorAcknowledgmentResultSchema>;
