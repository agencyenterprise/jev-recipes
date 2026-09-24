import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const changeWindowFitVerdictSchema = z.enum(['allowed', 'blocked']);
export const changeWindowFitInputSchema = z.object({
  change: nonEmptyText,
  policy: nonEmptyText,
  minConfidence: probability.optional(),
});
export const changeWindowFitResultSchema = gateResultSchema.extend({
  verdict: changeWindowFitVerdictSchema,
});

export type ChangeWindowFitVerdict = z.infer<typeof changeWindowFitVerdictSchema>;
export type ChangeWindowFitInput = z.infer<typeof changeWindowFitInputSchema>;
export type ChangeWindowFitResult = z.infer<typeof changeWindowFitResultSchema>;
