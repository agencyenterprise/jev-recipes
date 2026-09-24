import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const methodsFacetsLabelSchema = z.enum([
  'statesSampleSize',
  'statesDataSource',
  'statesAnalysisMethod',
  'statesLimitations',
  'statesPreregistration',
]);
export const methodsFacetsInputSchema = z.object({
  methods: nonEmptyText,
  minConfidence: probability.optional(),
});
export const methodsFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(methodsFacetsLabelSchema),
  labels: z.object({
    statesSampleSize: labelCheckSchema,
    statesDataSource: labelCheckSchema,
    statesAnalysisMethod: labelCheckSchema,
    statesLimitations: labelCheckSchema,
    statesPreregistration: labelCheckSchema,
  }),
});

export type MethodsFacetsLabel = z.infer<typeof methodsFacetsLabelSchema>;
export type MethodsFacetsInput = z.infer<typeof methodsFacetsInputSchema>;
export type MethodsFacetsResult = z.infer<typeof methodsFacetsResultSchema>;
