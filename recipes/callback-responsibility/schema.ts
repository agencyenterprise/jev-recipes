import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const callbackResponsibilityVerdictSchema = z.enum([
  'business',
  'customer',
  'either',
  'none',
  'unclear',
]);
export const callbackResponsibilityInputSchema = z.object({
  conversation: nonEmptyText,
  roles: nonEmptyText,
  minConfidence: probability.optional(),
});
export const callbackResponsibilityResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: callbackResponsibilityVerdictSchema,
  confidence: probability,
  probabilities: z.record(callbackResponsibilityVerdictSchema, probability),
});

export type CallbackResponsibilityVerdict = z.infer<typeof callbackResponsibilityVerdictSchema>;
export type CallbackResponsibilityInput = z.infer<typeof callbackResponsibilityInputSchema>;
export type CallbackResponsibilityResult = z.infer<typeof callbackResponsibilityResultSchema>;
