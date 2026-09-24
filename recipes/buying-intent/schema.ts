import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const buyingIntentVerdictSchema = z.enum([
  'none',
  'curious',
  'evaluating',
  'ready',
  'committed',
]);

export const buyingIntentInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const buyingIntentResultSchema = scoreResultSchema.extend({
  intent: buyingIntentVerdictSchema,
});

export type BuyingIntentVerdict = z.infer<typeof buyingIntentVerdictSchema>;
export type BuyingIntentInput = z.infer<typeof buyingIntentInputSchema>;
export type BuyingIntentResult = z.infer<typeof buyingIntentResultSchema>;
