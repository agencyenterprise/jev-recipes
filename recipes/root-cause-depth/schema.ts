import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const rootCauseDepthVerdictSchema = z.enum([
  'symptom',
  'immediate',
  'contributing',
  'systemic',
  'verified',
]);
export const rootCauseDepthInputSchema = z.object({
  analysis: nonEmptyText,
  minConfidence: probability.optional(),
});
export const rootCauseDepthResultSchema = scoreResultSchema.extend({
  depth: rootCauseDepthVerdictSchema,
});

export type RootCauseDepthVerdict = z.infer<typeof rootCauseDepthVerdictSchema>;
export type RootCauseDepthInput = z.infer<typeof rootCauseDepthInputSchema>;
export type RootCauseDepthResult = z.infer<typeof rootCauseDepthResultSchema>;
