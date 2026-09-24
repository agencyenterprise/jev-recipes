import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const messageFacetsLabelSchema = z.enum([
  'asksQuestion',
  'reportsProblem',
  'requestsAction',
  'statesDeadline',
  'referencesPriorContact',
]);
export const messageFacetsInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const messageFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(messageFacetsLabelSchema),
  labels: z.object({
    asksQuestion: labelCheckSchema,
    reportsProblem: labelCheckSchema,
    requestsAction: labelCheckSchema,
    statesDeadline: labelCheckSchema,
    referencesPriorContact: labelCheckSchema,
  }),
});
export type MessageFacetsLabel = z.infer<typeof messageFacetsLabelSchema>;
export type MessageFacetsInput = z.infer<typeof messageFacetsInputSchema>;
export type MessageFacetsResult = z.infer<typeof messageFacetsResultSchema>;
