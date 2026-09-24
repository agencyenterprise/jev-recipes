import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const symptomFacetsLabelSchema = z.enum([
  'statesOnset',
  'statesSeverity',
  'statesDuration',
  'statesModifiers',
  'statesPriorTreatment',
]);
export const symptomFacetsInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const symptomFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(symptomFacetsLabelSchema),
  labels: z.object({
    statesOnset: labelCheckSchema,
    statesSeverity: labelCheckSchema,
    statesDuration: labelCheckSchema,
    statesModifiers: labelCheckSchema,
    statesPriorTreatment: labelCheckSchema,
  }),
});

export type SymptomFacetsLabel = z.infer<typeof symptomFacetsLabelSchema>;
export type SymptomFacetsInput = z.infer<typeof symptomFacetsInputSchema>;
export type SymptomFacetsResult = z.infer<typeof symptomFacetsResultSchema>;
