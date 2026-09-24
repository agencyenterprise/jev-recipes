import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const reviewFacetsLabelSchema = z.enum([
  'mentionsQuality',
  'mentionsPrice',
  'mentionsShipping',
  'mentionsService',
  'reportsDefect',
]);
export const reviewFacetsInputSchema = z.object({
  review: nonEmptyText,
  minConfidence: probability.optional(),
});
export const reviewFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(reviewFacetsLabelSchema),
  labels: z.object({
    mentionsQuality: labelCheckSchema,
    mentionsPrice: labelCheckSchema,
    mentionsShipping: labelCheckSchema,
    mentionsService: labelCheckSchema,
    reportsDefect: labelCheckSchema,
  }),
});
export type ReviewFacetsLabel = z.infer<typeof reviewFacetsLabelSchema>;
export type ReviewFacetsInput = z.infer<typeof reviewFacetsInputSchema>;
export type ReviewFacetsResult = z.infer<typeof reviewFacetsResultSchema>;
