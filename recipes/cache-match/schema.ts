import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const cacheMatchVerdictSchema = z.enum(['reusable', 'unsuitable', 'unclear']);
export const cacheMatchInputSchema = z.object({
  question: nonEmptyText,
  originalQuestion: nonEmptyText,
  cachedAnswer: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const cacheMatchResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: cacheMatchVerdictSchema,
  confidence: probability,
  probabilities: z.record(cacheMatchVerdictSchema, probability),
});
export type CacheMatchInput = z.infer<typeof cacheMatchInputSchema>;
export type CacheMatchResult = z.infer<typeof cacheMatchResultSchema>;
export type CacheMatchVerdict = z.infer<typeof cacheMatchVerdictSchema>;
