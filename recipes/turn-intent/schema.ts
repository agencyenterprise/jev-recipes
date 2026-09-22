import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const turnIntentVerdictSchema = z.enum([
  'request',
  'answer',
  'correction',
  'cancellation',
  'acknowledgment',
  'other',
  'unclear',
]);
export const turnIntentInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const turnIntentResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: turnIntentVerdictSchema,
  confidence: probability,
  probabilities: z.record(turnIntentVerdictSchema, probability),
});
export type TurnIntentInput = z.infer<typeof turnIntentInputSchema>;
export type TurnIntentResult = z.infer<typeof turnIntentResultSchema>;
export type TurnIntentVerdict = z.infer<typeof turnIntentVerdictSchema>;
