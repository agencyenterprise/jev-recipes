import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const appointmentRequestKindVerdictSchema = z.enum([
  'schedule',
  'reschedule',
  'cancel',
  'results',
  'refill',
  'question',
  'unclear',
]);
export const appointmentRequestKindInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const appointmentRequestKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: appointmentRequestKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(appointmentRequestKindVerdictSchema, probability),
});

export type AppointmentRequestKindVerdict = z.infer<typeof appointmentRequestKindVerdictSchema>;
export type AppointmentRequestKindInput = z.infer<typeof appointmentRequestKindInputSchema>;
export type AppointmentRequestKindResult = z.infer<typeof appointmentRequestKindResultSchema>;
