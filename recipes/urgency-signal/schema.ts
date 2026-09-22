import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const urgencySignalVerdictSchema = z.enum(['expressed', 'not_expressed', 'unclear']);
export const urgencySignalInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const urgencySignalResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: urgencySignalVerdictSchema,
  confidence: probability,
  probabilities: z.record(urgencySignalVerdictSchema, probability),
});
export type UrgencySignalInput = z.infer<typeof urgencySignalInputSchema>;
export type UrgencySignalResult = z.infer<typeof urgencySignalResultSchema>;
export type UrgencySignalVerdict = z.infer<typeof urgencySignalVerdictSchema>;
