import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const formatFitVerdictSchema = z.enum(['follows', 'deviates']);

export const formatFitInputSchema = z.object({
  request: nonEmptyText,
  response: nonEmptyText,
  minConfidence: probability.optional(),
});

export const formatFitResultSchema = gateResultSchema.extend({
  verdict: formatFitVerdictSchema,
});

export type FormatFitVerdict = z.infer<typeof formatFitVerdictSchema>;
export type FormatFitInput = z.infer<typeof formatFitInputSchema>;
export type FormatFitResult = z.infer<typeof formatFitResultSchema>;
