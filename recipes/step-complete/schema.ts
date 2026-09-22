import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const stepCompleteVerdictSchema = z.enum(['met', 'unmet', 'unclear']);
export const stepCompleteInputSchema = z.object({
  condition: nonEmptyText,
  evidence: nonEmptyText,
  minConfidence: probability.optional(),
});
export const stepCompleteResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: stepCompleteVerdictSchema,
  confidence: probability,
  probabilities: z.record(stepCompleteVerdictSchema, probability),
});
export type StepCompleteInput = z.infer<typeof stepCompleteInputSchema>;
export type StepCompleteResult = z.infer<typeof stepCompleteResultSchema>;
export type StepCompleteVerdict = z.infer<typeof stepCompleteVerdictSchema>;
