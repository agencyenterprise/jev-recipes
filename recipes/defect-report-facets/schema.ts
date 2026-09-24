import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const defectReportFacetsLabelSchema = z.enum([
  'statesPartId',
  'statesDefect',
  'statesDetectionPoint',
  'statesQuantity',
  'statesContainment',
]);
export const defectReportFacetsInputSchema = z.object({
  report: nonEmptyText,
  minConfidence: probability.optional(),
});
export const defectReportFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(defectReportFacetsLabelSchema),
  labels: z.object({
    statesPartId: labelCheckSchema,
    statesDefect: labelCheckSchema,
    statesDetectionPoint: labelCheckSchema,
    statesQuantity: labelCheckSchema,
    statesContainment: labelCheckSchema,
  }),
});

export type DefectReportFacetsLabel = z.infer<typeof defectReportFacetsLabelSchema>;
export type DefectReportFacetsInput = z.infer<typeof defectReportFacetsInputSchema>;
export type DefectReportFacetsResult = z.infer<typeof defectReportFacetsResultSchema>;
