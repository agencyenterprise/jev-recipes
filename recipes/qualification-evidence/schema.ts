import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const qualificationEvidenceVerdictSchema = z.enum(['evidenced', 'unevidenced']);

export const qualificationEvidenceInputSchema = z.object({
  requirement: nonEmptyText,
  profile: nonEmptyText,
  minConfidence: probability.optional(),
});

export const qualificationEvidenceResultSchema = gateResultSchema.extend({
  verdict: qualificationEvidenceVerdictSchema,
});

export type QualificationEvidenceVerdict = z.infer<typeof qualificationEvidenceVerdictSchema>;
export type QualificationEvidenceInput = z.infer<typeof qualificationEvidenceInputSchema>;
export type QualificationEvidenceResult = z.infer<typeof qualificationEvidenceResultSchema>;
