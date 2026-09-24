import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const privacyNoticeFacetsLabelSchema = z.enum([
  'statesDataCollected',
  'statesPurpose',
  'statesRetention',
  'statesSharing',
  'statesContact',
]);
export const privacyNoticeFacetsInputSchema = z.object({
  notice: nonEmptyText,
  minConfidence: probability.optional(),
});
export const privacyNoticeFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(privacyNoticeFacetsLabelSchema),
  labels: z.object({
    statesDataCollected: labelCheckSchema,
    statesPurpose: labelCheckSchema,
    statesRetention: labelCheckSchema,
    statesSharing: labelCheckSchema,
    statesContact: labelCheckSchema,
  }),
});
export type PrivacyNoticeFacetsLabel = z.infer<typeof privacyNoticeFacetsLabelSchema>;
export type PrivacyNoticeFacetsInput = z.infer<typeof privacyNoticeFacetsInputSchema>;
export type PrivacyNoticeFacetsResult = z.infer<typeof privacyNoticeFacetsResultSchema>;
