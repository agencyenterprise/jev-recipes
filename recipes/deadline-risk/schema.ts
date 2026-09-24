import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const deadlineRiskVerdictSchema = z.enum(['none', 'minor', 'moderate', 'high', 'missed']);
export const deadlineRiskInputSchema = z.object({
  deadline: nonEmptyText,
  progress: nonEmptyText,
  minConfidence: probability.optional(),
});
export const deadlineRiskResultSchema = scoreResultSchema.extend({
  risk: deadlineRiskVerdictSchema,
});

export type DeadlineRiskVerdict = z.infer<typeof deadlineRiskVerdictSchema>;
export type DeadlineRiskInput = z.infer<typeof deadlineRiskInputSchema>;
export type DeadlineRiskResult = z.infer<typeof deadlineRiskResultSchema>;
