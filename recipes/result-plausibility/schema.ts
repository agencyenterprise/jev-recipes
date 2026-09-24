import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const resultPlausibilityVerdictSchema = z.enum(['plausible', 'implausible']);

export const resultPlausibilityInputSchema = z.object({
  request: nonEmptyText,
  result: nonEmptyText,
  minConfidence: probability.optional(),
});

export const resultPlausibilityResultSchema = gateResultSchema.extend({
  verdict: resultPlausibilityVerdictSchema,
});

export type ResultPlausibilityVerdict = z.infer<typeof resultPlausibilityVerdictSchema>;
export type ResultPlausibilityInput = z.infer<typeof resultPlausibilityInputSchema>;
export type ResultPlausibilityResult = z.infer<typeof resultPlausibilityResultSchema>;
