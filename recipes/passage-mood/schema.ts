import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const passageMoodVerdictSchema = z.enum([
  'happy',
  'sad',
  'calm',
  'energetic',
  'tense',
  'romantic',
  'unclear',
]);
export const passageMoodInputSchema = z.object({
  passage: nonEmptyText,
  minConfidence: probability.optional(),
});
export const passageMoodResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: passageMoodVerdictSchema,
  confidence: probability,
  probabilities: z.record(passageMoodVerdictSchema, probability),
});

export type PassageMoodVerdict = z.infer<typeof passageMoodVerdictSchema>;
export type PassageMoodInput = z.infer<typeof passageMoodInputSchema>;
export type PassageMoodResult = z.infer<typeof passageMoodResultSchema>;
