import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const disclosureFacetsLabelSchema = z.enum([
  'statesKnownDefects',
  'statesPriorRepairs',
  'statesEnvironmentalHazards',
  'statesBoundaryIssues',
  'statesAssociationRules',
]);
export const disclosureFacetsInputSchema = z.object({
  disclosure: nonEmptyText,
  minConfidence: probability.optional(),
});
export const disclosureFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(disclosureFacetsLabelSchema),
  labels: z.object({
    statesKnownDefects: labelCheckSchema,
    statesPriorRepairs: labelCheckSchema,
    statesEnvironmentalHazards: labelCheckSchema,
    statesBoundaryIssues: labelCheckSchema,
    statesAssociationRules: labelCheckSchema,
  }),
});

export type DisclosureFacetsLabel = z.infer<typeof disclosureFacetsLabelSchema>;
export type DisclosureFacetsInput = z.infer<typeof disclosureFacetsInputSchema>;
export type DisclosureFacetsResult = z.infer<typeof disclosureFacetsResultSchema>;
