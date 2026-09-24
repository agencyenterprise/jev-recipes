import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const eligibilityFacetsLabelSchema = z.enum([
  'statesResidency',
  'statesIncome',
  'statesHouseholdSize',
  'statesIdentityDocuments',
  'statesPriorBenefits',
]);
export const eligibilityFacetsInputSchema = z.object({
  statement: nonEmptyText,
  minConfidence: probability.optional(),
});
export const eligibilityFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(eligibilityFacetsLabelSchema),
  labels: z.object({
    statesResidency: labelCheckSchema,
    statesIncome: labelCheckSchema,
    statesHouseholdSize: labelCheckSchema,
    statesIdentityDocuments: labelCheckSchema,
    statesPriorBenefits: labelCheckSchema,
  }),
});

export type EligibilityFacetsLabel = z.infer<typeof eligibilityFacetsLabelSchema>;
export type EligibilityFacetsInput = z.infer<typeof eligibilityFacetsInputSchema>;
export type EligibilityFacetsResult = z.infer<typeof eligibilityFacetsResultSchema>;
