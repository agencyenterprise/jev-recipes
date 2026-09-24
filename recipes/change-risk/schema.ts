import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const changeRiskVerdictSchema = z.enum([
  'negligible',
  'low',
  'moderate',
  'high',
  'critical',
]);

export const changeRiskInputSchema = z.object({
  change: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const changeRiskResultSchema = scoreResultSchema.extend({
  risk: changeRiskVerdictSchema,
});

export type ChangeRiskVerdict = z.infer<typeof changeRiskVerdictSchema>;
export type ChangeRiskInput = z.infer<typeof changeRiskInputSchema>;
export type ChangeRiskResult = z.infer<typeof changeRiskResultSchema>;
