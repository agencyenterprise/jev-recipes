import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const extractionFidelityVerdictSchema = z.enum(['poor', 'low', 'fair', 'high', 'exact']);

export const extractionFidelityInputSchema = z.object({
  source: nonEmptyText,
  extracted: nonEmptyText,
  minConfidence: probability.optional(),
});

export const extractionFidelityResultSchema = scoreResultSchema.extend({
  fidelity: extractionFidelityVerdictSchema,
});

export type ExtractionFidelityVerdict = z.infer<typeof extractionFidelityVerdictSchema>;
export type ExtractionFidelityInput = z.infer<typeof extractionFidelityInputSchema>;
export type ExtractionFidelityResult = z.infer<typeof extractionFidelityResultSchema>;
