import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const listingFactConsistencyVerdictSchema = z.enum(['contradicts', 'consistent']);
export const listingFactConsistencyInputSchema = z.object({
  description: nonEmptyText,
  facts: nonEmptyText,
  minConfidence: probability.optional(),
});
export const listingFactConsistencyResultSchema = gateResultSchema.extend({
  verdict: listingFactConsistencyVerdictSchema,
});

export type ListingFactConsistencyVerdict = z.infer<typeof listingFactConsistencyVerdictSchema>;
export type ListingFactConsistencyInput = z.infer<typeof listingFactConsistencyInputSchema>;
export type ListingFactConsistencyResult = z.infer<typeof listingFactConsistencyResultSchema>;
