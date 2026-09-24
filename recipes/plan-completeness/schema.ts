import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const planCompletenessVerdictSchema = z.enum([
  'none',
  'partial',
  'mostly',
  'nearly',
  'complete',
]);

export const planCompletenessInputSchema = z.object({
  task: nonEmptyText,
  plan: nonEmptyText,
  minConfidence: probability.optional(),
});

export const planCompletenessResultSchema = scoreResultSchema.extend({
  completeness: planCompletenessVerdictSchema,
});

export type PlanCompletenessVerdict = z.infer<typeof planCompletenessVerdictSchema>;
export type PlanCompletenessInput = z.infer<typeof planCompletenessInputSchema>;
export type PlanCompletenessResult = z.infer<typeof planCompletenessResultSchema>;
