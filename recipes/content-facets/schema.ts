import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const contentFacetsLabelSchema = z.enum([
  'statesThesis',
  'providesEvidence',
  'addressesCounterarguments',
  'includesCallToAction',
  'signalsExpertise',
]);
export const contentFacetsInputSchema = z.object({
  article: nonEmptyText,
  minConfidence: probability.optional(),
});
export const contentFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(contentFacetsLabelSchema),
  labels: z.object({
    statesThesis: labelCheckSchema,
    providesEvidence: labelCheckSchema,
    addressesCounterarguments: labelCheckSchema,
    includesCallToAction: labelCheckSchema,
    signalsExpertise: labelCheckSchema,
  }),
});

export type ContentFacetsLabel = z.infer<typeof contentFacetsLabelSchema>;
export type ContentFacetsInput = z.infer<typeof contentFacetsInputSchema>;
export type ContentFacetsResult = z.infer<typeof contentFacetsResultSchema>;
