import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const troubleshootingFitVerdictSchema = z.enum(['applicable', 'unsuitable', 'unclear']);
export const troubleshootingFitInputSchema = z.object({
  symptoms: nonEmptyText,
  procedure: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const troubleshootingFitResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: troubleshootingFitVerdictSchema,
  confidence: probability,
  probabilities: z.record(troubleshootingFitVerdictSchema, probability),
});
export type TroubleshootingFitInput = z.infer<typeof troubleshootingFitInputSchema>;
export type TroubleshootingFitResult = z.infer<typeof troubleshootingFitResultSchema>;
export type TroubleshootingFitVerdict = z.infer<typeof troubleshootingFitVerdictSchema>;
