import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const moveExplanationFitVerdictSchema = z.enum(['consistent', 'inconsistent']);
export const moveExplanationFitInputSchema = z.object({
  move: nonEmptyText,
  explanation: nonEmptyText,
  state: nonEmptyText,
  minConfidence: probability.optional(),
});
export const moveExplanationFitResultSchema = gateResultSchema.extend({
  verdict: moveExplanationFitVerdictSchema,
});

export type MoveExplanationFitVerdict = z.infer<typeof moveExplanationFitVerdictSchema>;
export type MoveExplanationFitInput = z.infer<typeof moveExplanationFitInputSchema>;
export type MoveExplanationFitResult = z.infer<typeof moveExplanationFitResultSchema>;
