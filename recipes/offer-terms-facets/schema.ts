import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const offerTermsFacetsLabelSchema = z.enum([
  'statesPrice',
  'statesFinancing',
  'statesContingencies',
  'statesClosingDate',
  'statesDeposit',
]);
export const offerTermsFacetsInputSchema = z.object({
  offer: nonEmptyText,
  minConfidence: probability.optional(),
});
export const offerTermsFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(offerTermsFacetsLabelSchema),
  labels: z.object({
    statesPrice: labelCheckSchema,
    statesFinancing: labelCheckSchema,
    statesContingencies: labelCheckSchema,
    statesClosingDate: labelCheckSchema,
    statesDeposit: labelCheckSchema,
  }),
});

export type OfferTermsFacetsLabel = z.infer<typeof offerTermsFacetsLabelSchema>;
export type OfferTermsFacetsInput = z.infer<typeof offerTermsFacetsInputSchema>;
export type OfferTermsFacetsResult = z.infer<typeof offerTermsFacetsResultSchema>;
