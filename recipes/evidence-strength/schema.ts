import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const evidenceStrengthVerdictSchema = z.enum([
  'none',
  'weak',
  'moderate',
  'strong',
  'conclusive',
]);

export const evidenceStrengthInputSchema = z.object({
  claim: nonEmptyText,
  evidence: nonEmptyText,
  minConfidence: probability.optional(),
});

export const evidenceStrengthResultSchema = scoreResultSchema.extend({
  strength: evidenceStrengthVerdictSchema,
});

export type EvidenceStrengthVerdict = z.infer<typeof evidenceStrengthVerdictSchema>;
export type EvidenceStrengthInput = z.infer<typeof evidenceStrengthInputSchema>;
export type EvidenceStrengthResult = z.infer<typeof evidenceStrengthResultSchema>;
