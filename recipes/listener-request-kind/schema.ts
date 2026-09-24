import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const listenerRequestKindVerdictSchema = z.enum([
  'mood',
  'tempo',
  'style',
  'specific_piece',
  'dynamics',
  'stop',
  'unclear',
]);
export const listenerRequestKindInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const listenerRequestKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: listenerRequestKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(listenerRequestKindVerdictSchema, probability),
});

export type ListenerRequestKindVerdict = z.infer<typeof listenerRequestKindVerdictSchema>;
export type ListenerRequestKindInput = z.infer<typeof listenerRequestKindInputSchema>;
export type ListenerRequestKindResult = z.infer<typeof listenerRequestKindResultSchema>;
