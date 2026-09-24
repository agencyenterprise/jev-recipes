import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const tripPurposeKindVerdictSchema = z.enum([
  'business',
  'leisure',
  'family_visit',
  'medical',
  'relocation',
  'event',
  'unclear',
]);
export const tripPurposeKindInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const tripPurposeKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: tripPurposeKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(tripPurposeKindVerdictSchema, probability),
});

export type TripPurposeKindVerdict = z.infer<typeof tripPurposeKindVerdictSchema>;
export type TripPurposeKindInput = z.infer<typeof tripPurposeKindInputSchema>;
export type TripPurposeKindResult = z.infer<typeof tripPurposeKindResultSchema>;
