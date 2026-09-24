import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const guestRequestFacetsLabelSchema = z.enum([
  'statesDates',
  'statesPartySize',
  'statesAccessibilityNeeds',
  'statesBudget',
  'statesOccasion',
]);
export const guestRequestFacetsInputSchema = z.object({
  request: nonEmptyText,
  minConfidence: probability.optional(),
});
export const guestRequestFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(guestRequestFacetsLabelSchema),
  labels: z.object({
    statesDates: labelCheckSchema,
    statesPartySize: labelCheckSchema,
    statesAccessibilityNeeds: labelCheckSchema,
    statesBudget: labelCheckSchema,
    statesOccasion: labelCheckSchema,
  }),
});

export type GuestRequestFacetsLabel = z.infer<typeof guestRequestFacetsLabelSchema>;
export type GuestRequestFacetsInput = z.infer<typeof guestRequestFacetsInputSchema>;
export type GuestRequestFacetsResult = z.infer<typeof guestRequestFacetsResultSchema>;
