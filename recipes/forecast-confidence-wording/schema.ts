import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const forecastConfidenceWordingVerdictSchema = z.enum([
  'speculative',
  'hedged',
  'balanced',
  'confident',
  'asserted',
]);
export const forecastConfidenceWordingInputSchema = z.object({
  statement: nonEmptyText,
  minConfidence: probability.optional(),
});
export const forecastConfidenceWordingResultSchema = scoreResultSchema.extend({
  certainty: forecastConfidenceWordingVerdictSchema,
});

export type ForecastConfidenceWordingVerdict = z.infer<
  typeof forecastConfidenceWordingVerdictSchema
>;
export type ForecastConfidenceWordingInput = z.infer<typeof forecastConfidenceWordingInputSchema>;
export type ForecastConfidenceWordingResult = z.infer<typeof forecastConfidenceWordingResultSchema>;
