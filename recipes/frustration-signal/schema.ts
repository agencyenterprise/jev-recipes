import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const frustrationSignalVerdictSchema = z.enum(['expressed', 'not_expressed', 'unclear']);
export const frustrationSignalInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const frustrationSignalResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: frustrationSignalVerdictSchema,
  confidence: probability,
  probabilities: z.record(frustrationSignalVerdictSchema, probability),
});
export type FrustrationSignalInput = z.infer<typeof frustrationSignalInputSchema>;
export type FrustrationSignalResult = z.infer<typeof frustrationSignalResultSchema>;
export type FrustrationSignalVerdict = z.infer<typeof frustrationSignalVerdictSchema>;
