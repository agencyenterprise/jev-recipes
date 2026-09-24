import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const safetyIncidentKindVerdictSchema = z.enum([
  'near_miss',
  'first_aid',
  'medical_treatment',
  'property_damage',
  'environmental_release',
  'unsafe_condition',
  'unclear',
]);
export const safetyIncidentKindInputSchema = z.object({
  report: nonEmptyText,
  minConfidence: probability.optional(),
});
export const safetyIncidentKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: safetyIncidentKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(safetyIncidentKindVerdictSchema, probability),
});

export type SafetyIncidentKindVerdict = z.infer<typeof safetyIncidentKindVerdictSchema>;
export type SafetyIncidentKindInput = z.infer<typeof safetyIncidentKindInputSchema>;
export type SafetyIncidentKindResult = z.infer<typeof safetyIncidentKindResultSchema>;
