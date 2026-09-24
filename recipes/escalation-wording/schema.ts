import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const escalationWordingVerdictSchema = z.enum(['requested', 'absent']);
export const escalationWordingInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const escalationWordingResultSchema = gateResultSchema.extend({
  verdict: escalationWordingVerdictSchema,
});

export type EscalationWordingVerdict = z.infer<typeof escalationWordingVerdictSchema>;
export type EscalationWordingInput = z.infer<typeof escalationWordingInputSchema>;
export type EscalationWordingResult = z.infer<typeof escalationWordingResultSchema>;
