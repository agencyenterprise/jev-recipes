import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const postmortemFacetsLabelSchema = z.enum([
  'statesTimeline',
  'statesRootCause',
  'statesImpact',
  'statesContributingFactors',
  'statesActionItems',
]);
export const postmortemFacetsInputSchema = z.object({
  postmortem: nonEmptyText,
  minConfidence: probability.optional(),
});
export const postmortemFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(postmortemFacetsLabelSchema),
  labels: z.object({
    statesTimeline: labelCheckSchema,
    statesRootCause: labelCheckSchema,
    statesImpact: labelCheckSchema,
    statesContributingFactors: labelCheckSchema,
    statesActionItems: labelCheckSchema,
  }),
});

export type PostmortemFacetsLabel = z.infer<typeof postmortemFacetsLabelSchema>;
export type PostmortemFacetsInput = z.infer<typeof postmortemFacetsInputSchema>;
export type PostmortemFacetsResult = z.infer<typeof postmortemFacetsResultSchema>;
