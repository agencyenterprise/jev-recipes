import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const jobPostFacetsLabelSchema = z.enum([
  'statesSalary',
  'statesLocation',
  'statesRemotePolicy',
  'statesExperienceLevel',
  'statesQualifications',
]);
export const jobPostFacetsInputSchema = z.object({
  posting: nonEmptyText,
  minConfidence: probability.optional(),
});
export const jobPostFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(jobPostFacetsLabelSchema),
  labels: z.object({
    statesSalary: labelCheckSchema,
    statesLocation: labelCheckSchema,
    statesRemotePolicy: labelCheckSchema,
    statesExperienceLevel: labelCheckSchema,
    statesQualifications: labelCheckSchema,
  }),
});
export type JobPostFacetsLabel = z.infer<typeof jobPostFacetsLabelSchema>;
export type JobPostFacetsInput = z.infer<typeof jobPostFacetsInputSchema>;
export type JobPostFacetsResult = z.infer<typeof jobPostFacetsResultSchema>;
