import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const explanationLevelVerdictSchema = z.enum([
  'bare',
  'asserted',
  'partial',
  'complete',
  'rigorous',
]);

export const explanationLevelInputSchema = z.object({
  question: nonEmptyText,
  answer: nonEmptyText,
  minConfidence: probability.optional(),
});

export const explanationLevelResultSchema = scoreResultSchema.extend({
  explanation: explanationLevelVerdictSchema,
});

export type ExplanationLevelVerdict = z.infer<typeof explanationLevelVerdictSchema>;
export type ExplanationLevelInput = z.infer<typeof explanationLevelInputSchema>;
export type ExplanationLevelResult = z.infer<typeof explanationLevelResultSchema>;
