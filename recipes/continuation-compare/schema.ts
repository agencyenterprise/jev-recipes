import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const continuationCompareVerdictSchema = comparisonVerdictSchema;
export const continuationCompareInputSchema = z.object({
  context: nonEmptyText,
  firstContinuation: nonEmptyText,
  secondContinuation: nonEmptyText,
  style: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const continuationCompareResultSchema = comparisonResultSchema;

export type ContinuationCompareVerdict = z.infer<typeof continuationCompareVerdictSchema>;
export type ContinuationCompareInput = z.infer<typeof continuationCompareInputSchema>;
export type ContinuationCompareResult = z.infer<typeof continuationCompareResultSchema>;
