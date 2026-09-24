import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const retryWorthwhileVerdictSchema = z.enum(['retry', 'stop']);

export const retryWorthwhileInputSchema = z.object({
  failure: nonEmptyText,
  attempt: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const retryWorthwhileResultSchema = gateResultSchema.extend({
  verdict: retryWorthwhileVerdictSchema,
});

export type RetryWorthwhileVerdict = z.infer<typeof retryWorthwhileVerdictSchema>;
export type RetryWorthwhileInput = z.infer<typeof retryWorthwhileInputSchema>;
export type RetryWorthwhileResult = z.infer<typeof retryWorthwhileResultSchema>;
