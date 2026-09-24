import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const goalDriftVerdictSchema = z.enum(['drifted', 'aligned']);

export const goalDriftInputSchema = z.object({
  goal: nonEmptyText,
  step: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const goalDriftResultSchema = gateResultSchema.extend({
  verdict: goalDriftVerdictSchema,
});

export type GoalDriftVerdict = z.infer<typeof goalDriftVerdictSchema>;
export type GoalDriftInput = z.infer<typeof goalDriftInputSchema>;
export type GoalDriftResult = z.infer<typeof goalDriftResultSchema>;
