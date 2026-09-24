import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const performanceFeedbackFacetsLabelSchema = z.enum([
  'mentionsRhythm',
  'mentionsPitch',
  'mentionsDynamics',
  'mentionsTechnique',
  'mentionsExpression',
]);
export const performanceFeedbackFacetsInputSchema = z.object({
  feedback: nonEmptyText,
  minConfidence: probability.optional(),
});
export const performanceFeedbackFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(performanceFeedbackFacetsLabelSchema),
  labels: z.object({
    mentionsRhythm: labelCheckSchema,
    mentionsPitch: labelCheckSchema,
    mentionsDynamics: labelCheckSchema,
    mentionsTechnique: labelCheckSchema,
    mentionsExpression: labelCheckSchema,
  }),
});

export type PerformanceFeedbackFacetsLabel = z.infer<typeof performanceFeedbackFacetsLabelSchema>;
export type PerformanceFeedbackFacetsInput = z.infer<typeof performanceFeedbackFacetsInputSchema>;
export type PerformanceFeedbackFacetsResult = z.infer<typeof performanceFeedbackFacetsResultSchema>;
