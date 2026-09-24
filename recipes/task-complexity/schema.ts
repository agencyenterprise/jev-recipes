import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const taskComplexityVerdictSchema = z.enum([
  'trivial',
  'simple',
  'moderate',
  'complex',
  'open-ended',
]);

export const taskComplexityInputSchema = z.object({
  task: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const taskComplexityResultSchema = scoreResultSchema.extend({
  complexity: taskComplexityVerdictSchema,
});

export type TaskComplexityVerdict = z.infer<typeof taskComplexityVerdictSchema>;
export type TaskComplexityInput = z.infer<typeof taskComplexityInputSchema>;
export type TaskComplexityResult = z.infer<typeof taskComplexityResultSchema>;
