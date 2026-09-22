import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const resolutionCheckVerdictSchema = z.enum(['resolved', 'unresolved', 'unclear']);
export const resolutionCheckInputSchema = z.object({
  issue: nonEmptyText,
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const resolutionCheckResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: resolutionCheckVerdictSchema,
  confidence: probability,
  probabilities: z.record(resolutionCheckVerdictSchema, probability),
});
export type ResolutionCheckInput = z.infer<typeof resolutionCheckInputSchema>;
export type ResolutionCheckResult = z.infer<typeof resolutionCheckResultSchema>;
export type ResolutionCheckVerdict = z.infer<typeof resolutionCheckVerdictSchema>;
