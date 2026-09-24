import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const claimFacetsLabelSchema = z.enum([
  'statesWhen',
  'statesWhere',
  'statesCause',
  'statesDamages',
  'statesEvidence',
]);
export const claimFacetsInputSchema = z.object({
  claim: nonEmptyText,
  minConfidence: probability.optional(),
});
export const claimFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(claimFacetsLabelSchema),
  labels: z.object({
    statesWhen: labelCheckSchema,
    statesWhere: labelCheckSchema,
    statesCause: labelCheckSchema,
    statesDamages: labelCheckSchema,
    statesEvidence: labelCheckSchema,
  }),
});

export type ClaimFacetsLabel = z.infer<typeof claimFacetsLabelSchema>;
export type ClaimFacetsInput = z.infer<typeof claimFacetsInputSchema>;
export type ClaimFacetsResult = z.infer<typeof claimFacetsResultSchema>;
