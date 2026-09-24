import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const actionReversibilityVerdictSchema = z.enum([
  'trivial',
  'effortful',
  'partial',
  'practical',
  'irreversible',
]);

export const actionReversibilityInputSchema = z.object({
  action: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const actionReversibilityResultSchema = scoreResultSchema.extend({
  reversibility: actionReversibilityVerdictSchema,
});

export type ActionReversibilityVerdict = z.infer<typeof actionReversibilityVerdictSchema>;
export type ActionReversibilityInput = z.infer<typeof actionReversibilityInputSchema>;
export type ActionReversibilityResult = z.infer<typeof actionReversibilityResultSchema>;
