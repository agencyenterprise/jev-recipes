import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const headlineFitVerdictSchema = z.enum(['accurate', 'misleading']);
export const headlineFitInputSchema = z.object({
  headline: nonEmptyText,
  body: nonEmptyText,
  minConfidence: probability.optional(),
});
export const headlineFitResultSchema = gateResultSchema.extend({
  verdict: headlineFitVerdictSchema,
});

export type HeadlineFitVerdict = z.infer<typeof headlineFitVerdictSchema>;
export type HeadlineFitInput = z.infer<typeof headlineFitInputSchema>;
export type HeadlineFitResult = z.infer<typeof headlineFitResultSchema>;
