import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const evidenceConflictVerdictSchema = z.enum([
  'compatible',
  'conflicting',
  'different_scope',
  'unclear',
]);
export const evidenceConflictInputSchema = z.object({
  firstPassage: nonEmptyText,
  secondPassage: nonEmptyText,
  question: nonEmptyText,
  minConfidence: probability.optional(),
});
export const evidenceConflictResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: evidenceConflictVerdictSchema,
  confidence: probability,
  probabilities: z.record(evidenceConflictVerdictSchema, probability),
});
export type EvidenceConflictInput = z.infer<typeof evidenceConflictInputSchema>;
export type EvidenceConflictResult = z.infer<typeof evidenceConflictResultSchema>;
export type EvidenceConflictVerdict = z.infer<typeof evidenceConflictVerdictSchema>;
