import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const settlementOfferFacetsLabelSchema = z.enum([
  'statesAmount',
  'statesBasis',
  'statesDeadline',
  'statesReleaseTerms',
  'statesDisputePath',
]);
export const settlementOfferFacetsInputSchema = z.object({
  offer: nonEmptyText,
  minConfidence: probability.optional(),
});
export const settlementOfferFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(settlementOfferFacetsLabelSchema),
  labels: z.object({
    statesAmount: labelCheckSchema,
    statesBasis: labelCheckSchema,
    statesDeadline: labelCheckSchema,
    statesReleaseTerms: labelCheckSchema,
    statesDisputePath: labelCheckSchema,
  }),
});

export type SettlementOfferFacetsLabel = z.infer<typeof settlementOfferFacetsLabelSchema>;
export type SettlementOfferFacetsInput = z.infer<typeof settlementOfferFacetsInputSchema>;
export type SettlementOfferFacetsResult = z.infer<typeof settlementOfferFacetsResultSchema>;
