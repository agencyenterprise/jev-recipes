import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const alertActionabilityVerdictSchema = z.enum([
  'noise',
  'vague',
  'symptom',
  'located',
  'guided',
]);
export const alertActionabilityInputSchema = z.object({
  alert: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const alertActionabilityResultSchema = scoreResultSchema.extend({
  actionability: alertActionabilityVerdictSchema,
});

export type AlertActionabilityVerdict = z.infer<typeof alertActionabilityVerdictSchema>;
export type AlertActionabilityInput = z.infer<typeof alertActionabilityInputSchema>;
export type AlertActionabilityResult = z.infer<typeof alertActionabilityResultSchema>;
