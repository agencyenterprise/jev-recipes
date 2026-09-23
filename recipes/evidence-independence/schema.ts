import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';
export const evidenceIndependenceVerdictSchema = z.enum([
  'shared_origin',
  'separate_origins',
  'unclear',
]);
export const evidenceIndependenceInputSchema = z.object({
  claim: nonEmptyText.describe('One claim that defines which supporting evidence origins matter.'),
  firstProvenance: nonEmptyText.describe(
    "The first report's supplied source chain, observations, data collection, or other origin details for the claim.",
  ),
  secondProvenance: nonEmptyText.describe(
    "The second report's supplied source chain, observations, data collection, or other origin details for the claim.",
  ),
  minConfidence: probability.optional(),
});
export const evidenceIndependenceResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: evidenceIndependenceVerdictSchema,
  confidence: probability,
  probabilities: z.record(evidenceIndependenceVerdictSchema, probability),
});
export type EvidenceIndependenceInput = z.infer<typeof evidenceIndependenceInputSchema>;
export type EvidenceIndependenceResult = z.infer<typeof evidenceIndependenceResultSchema>;
export type EvidenceIndependenceVerdict = z.infer<typeof evidenceIndependenceVerdictSchema>;
