import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const reportFacetsLabelSchema = z.enum([
  'statesOutcome',
  'providesEvidence',
  'statesBlockers',
  'statesNextStep',
  'raisesQuestions',
]);
export const reportFacetsInputSchema = z.object({
  report: nonEmptyText,
  minConfidence: probability.optional(),
});
export const reportFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(reportFacetsLabelSchema),
  labels: z.object({
    statesOutcome: labelCheckSchema,
    providesEvidence: labelCheckSchema,
    statesBlockers: labelCheckSchema,
    statesNextStep: labelCheckSchema,
    raisesQuestions: labelCheckSchema,
  }),
});
export type ReportFacetsLabel = z.infer<typeof reportFacetsLabelSchema>;
export type ReportFacetsInput = z.infer<typeof reportFacetsInputSchema>;
export type ReportFacetsResult = z.infer<typeof reportFacetsResultSchema>;
