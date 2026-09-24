import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const productMatchVerdictSchema = z.enum(['matches', 'mismatched']);

export const productMatchInputSchema = z.object({
  request: nonEmptyText,
  listing: nonEmptyText,
  minConfidence: probability.optional(),
});

export const productMatchResultSchema = gateResultSchema.extend({
  verdict: productMatchVerdictSchema,
});

export type ProductMatchVerdict = z.infer<typeof productMatchVerdictSchema>;
export type ProductMatchInput = z.infer<typeof productMatchInputSchema>;
export type ProductMatchResult = z.infer<typeof productMatchResultSchema>;
