import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const instrumentReportFacetsLabelSchema = z.enum([
  'statesInstrument',
  'statesSymptom',
  'statesOnset',
  'statesRecentChanges',
  'statesEnvironment',
]);
export const instrumentReportFacetsInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const instrumentReportFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(instrumentReportFacetsLabelSchema),
  labels: z.object({
    statesInstrument: labelCheckSchema,
    statesSymptom: labelCheckSchema,
    statesOnset: labelCheckSchema,
    statesRecentChanges: labelCheckSchema,
    statesEnvironment: labelCheckSchema,
  }),
});

export type InstrumentReportFacetsLabel = z.infer<typeof instrumentReportFacetsLabelSchema>;
export type InstrumentReportFacetsInput = z.infer<typeof instrumentReportFacetsInputSchema>;
export type InstrumentReportFacetsResult = z.infer<typeof instrumentReportFacetsResultSchema>;
