import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const listingCompareVerdictSchema = comparisonVerdictSchema;
export const listingCompareInputSchema = z.object({
  request: nonEmptyText,
  firstListing: nonEmptyText,
  secondListing: nonEmptyText,
  minConfidence: probability.optional(),
});
export const listingCompareResultSchema = comparisonResultSchema;
export type ListingCompareVerdict = z.infer<typeof listingCompareVerdictSchema>;
export type ListingCompareInput = z.infer<typeof listingCompareInputSchema>;
export type ListingCompareResult = z.infer<typeof listingCompareResultSchema>;
