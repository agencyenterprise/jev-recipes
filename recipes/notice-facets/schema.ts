import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const noticeFacetsLabelSchema = z.enum([
  'statesAction',
  'statesDeadline',
  'statesConsequence',
  'statesContact',
  'statesAppealRight',
]);
export const noticeFacetsInputSchema = z.object({
  notice: nonEmptyText,
  minConfidence: probability.optional(),
});
export const noticeFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(noticeFacetsLabelSchema),
  labels: z.object({
    statesAction: labelCheckSchema,
    statesDeadline: labelCheckSchema,
    statesConsequence: labelCheckSchema,
    statesContact: labelCheckSchema,
    statesAppealRight: labelCheckSchema,
  }),
});

export type NoticeFacetsLabel = z.infer<typeof noticeFacetsLabelSchema>;
export type NoticeFacetsInput = z.infer<typeof noticeFacetsInputSchema>;
export type NoticeFacetsResult = z.infer<typeof noticeFacetsResultSchema>;
