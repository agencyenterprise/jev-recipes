import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const policySeverityVerdictSchema = z.enum([
  'none',
  'minor',
  'moderate',
  'serious',
  'severe',
]);

export const policySeverityInputSchema = z.object({
  content: nonEmptyText,
  policy: nonEmptyText,
  minConfidence: probability.optional(),
});

export const policySeverityResultSchema = scoreResultSchema.extend({
  severity: policySeverityVerdictSchema,
});

export type PolicySeverityVerdict = z.infer<typeof policySeverityVerdictSchema>;
export type PolicySeverityInput = z.infer<typeof policySeverityInputSchema>;
export type PolicySeverityResult = z.infer<typeof policySeverityResultSchema>;
