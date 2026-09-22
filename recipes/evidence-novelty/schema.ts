import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const evidenceNoveltyVerdictSchema = z.enum([
  'adds_information',
  'repeats_information',
  'irrelevant',
  'unclear',
]);
export const evidenceNoveltyInputSchema = z.object({
  passage: nonEmptyText,
  existingEvidence: textItemsSchema,
  question: nonEmptyText,
  minConfidence: probability.optional(),
});
export const evidenceNoveltyResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: evidenceNoveltyVerdictSchema,
  confidence: probability,
  probabilities: z.record(evidenceNoveltyVerdictSchema, probability),
});
export type EvidenceNoveltyInput = z.infer<typeof evidenceNoveltyInputSchema>;
export type EvidenceNoveltyResult = z.infer<typeof evidenceNoveltyResultSchema>;
export type EvidenceNoveltyVerdict = z.infer<typeof evidenceNoveltyVerdictSchema>;
