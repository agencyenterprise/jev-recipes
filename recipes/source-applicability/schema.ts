import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const sourceApplicabilityVerdictSchema = z.enum(['applies', 'does_not_apply', 'unclear']);
export const sourceApplicabilityInputSchema = z.object({
  passage: nonEmptyText,
  scenario: nonEmptyText,
  minConfidence: probability.optional(),
});
export const sourceApplicabilityResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: sourceApplicabilityVerdictSchema,
  confidence: probability,
  probabilities: z.record(sourceApplicabilityVerdictSchema, probability),
});
export type SourceApplicabilityInput = z.infer<typeof sourceApplicabilityInputSchema>;
export type SourceApplicabilityResult = z.infer<typeof sourceApplicabilityResultSchema>;
export type SourceApplicabilityVerdict = z.infer<typeof sourceApplicabilityVerdictSchema>;
