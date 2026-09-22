import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const factStabilityVerdictSchema = z.enum(['stable', 'changeable', 'unclear']);
export const factStabilityInputSchema = z.object({
  fact: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const factStabilityResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: factStabilityVerdictSchema,
  confidence: probability,
  probabilities: z.record(factStabilityVerdictSchema, probability),
});
export type FactStabilityInput = z.infer<typeof factStabilityInputSchema>;
export type FactStabilityResult = z.infer<typeof factStabilityResultSchema>;
export type FactStabilityVerdict = z.infer<typeof factStabilityVerdictSchema>;
