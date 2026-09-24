import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const objectiveFitVerdictSchema = z.enum(['assesses', 'misses']);

export const objectiveFitInputSchema = z.object({
  objective: nonEmptyText,
  question: nonEmptyText,
  minConfidence: probability.optional(),
});

export const objectiveFitResultSchema = gateResultSchema.extend({
  verdict: objectiveFitVerdictSchema,
});

export type ObjectiveFitVerdict = z.infer<typeof objectiveFitVerdictSchema>;
export type ObjectiveFitInput = z.infer<typeof objectiveFitInputSchema>;
export type ObjectiveFitResult = z.infer<typeof objectiveFitResultSchema>;
