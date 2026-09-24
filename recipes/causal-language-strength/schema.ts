import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const causalLanguageStrengthVerdictSchema = z.enum([
  'none',
  'association',
  'suggestive',
  'hedged',
  'asserted',
]);
export const causalLanguageStrengthInputSchema = z.object({
  statement: nonEmptyText,
  minConfidence: probability.optional(),
});
export const causalLanguageStrengthResultSchema = scoreResultSchema.extend({
  causality: causalLanguageStrengthVerdictSchema,
});

export type CausalLanguageStrengthVerdict = z.infer<typeof causalLanguageStrengthVerdictSchema>;
export type CausalLanguageStrengthInput = z.infer<typeof causalLanguageStrengthInputSchema>;
export type CausalLanguageStrengthResult = z.infer<typeof causalLanguageStrengthResultSchema>;
