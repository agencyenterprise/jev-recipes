import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const incidentSeverityWordingVerdictSchema = z.enum([
  'none',
  'minor',
  'partial',
  'major',
  'critical',
]);
export const incidentSeverityWordingInputSchema = z.object({
  report: nonEmptyText,
  minConfidence: probability.optional(),
});
export const incidentSeverityWordingResultSchema = scoreResultSchema.extend({
  severity: incidentSeverityWordingVerdictSchema,
});

export type IncidentSeverityWordingVerdict = z.infer<typeof incidentSeverityWordingVerdictSchema>;
export type IncidentSeverityWordingInput = z.infer<typeof incidentSeverityWordingInputSchema>;
export type IncidentSeverityWordingResult = z.infer<typeof incidentSeverityWordingResultSchema>;
