import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const consentRequestVerdictSchema = z.enum(['requested', 'absent']);

export const consentRequestInputSchema = z.object({
  text: nonEmptyText,
  minConfidence: probability.optional(),
});

export const consentRequestResultSchema = gateResultSchema.extend({
  verdict: consentRequestVerdictSchema,
});

export type ConsentRequestVerdict = z.infer<typeof consentRequestVerdictSchema>;
export type ConsentRequestInput = z.infer<typeof consentRequestInputSchema>;
export type ConsentRequestResult = z.infer<typeof consentRequestResultSchema>;
