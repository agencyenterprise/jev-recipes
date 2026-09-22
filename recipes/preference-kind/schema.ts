import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const preferenceKindVerdictSchema = z.enum([
  'preference',
  'fact',
  'temporary_request',
  'unclear',
]);
export const preferenceKindInputSchema = z.object({
  statement: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const preferenceKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: preferenceKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(preferenceKindVerdictSchema, probability),
});
export type PreferenceKindInput = z.infer<typeof preferenceKindInputSchema>;
export type PreferenceKindResult = z.infer<typeof preferenceKindResultSchema>;
export type PreferenceKindVerdict = z.infer<typeof preferenceKindVerdictSchema>;
