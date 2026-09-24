import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const correctiveActionFitVerdictSchema = z.enum(['addresses', 'misses']);
export const correctiveActionFitInputSchema = z.object({
  rootCause: nonEmptyText,
  action: nonEmptyText,
  minConfidence: probability.optional(),
});
export const correctiveActionFitResultSchema = gateResultSchema.extend({
  verdict: correctiveActionFitVerdictSchema,
});

export type CorrectiveActionFitVerdict = z.infer<typeof correctiveActionFitVerdictSchema>;
export type CorrectiveActionFitInput = z.infer<typeof correctiveActionFitInputSchema>;
export type CorrectiveActionFitResult = z.infer<typeof correctiveActionFitResultSchema>;
