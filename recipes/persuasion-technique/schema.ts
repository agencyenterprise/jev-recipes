import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const persuasionTechniqueVerdictSchema = z.enum([
  'authority',
  'scarcity',
  'social_proof',
  'reciprocity',
  'emotional_appeal',
  'none',
  'unclear',
]);
export const persuasionTechniqueInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const persuasionTechniqueResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: persuasionTechniqueVerdictSchema,
  confidence: probability,
  probabilities: z.record(persuasionTechniqueVerdictSchema, probability),
});
export type PersuasionTechniqueInput = z.infer<typeof persuasionTechniqueInputSchema>;
export type PersuasionTechniqueResult = z.infer<typeof persuasionTechniqueResultSchema>;
export type PersuasionTechniqueVerdict = z.infer<typeof persuasionTechniqueVerdictSchema>;
