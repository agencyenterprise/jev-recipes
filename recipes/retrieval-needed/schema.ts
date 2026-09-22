import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const retrievalNeededVerdictSchema = z.enum(['needed', 'unnecessary', 'unclear']);
export const retrievalNeededInputSchema = z.object({
  request: nonEmptyText,
  context: nonEmptyText,
  minConfidence: probability.optional(),
});
export const retrievalNeededResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: retrievalNeededVerdictSchema,
  confidence: probability,
  probabilities: z.record(retrievalNeededVerdictSchema, probability),
});
export type RetrievalNeededInput = z.infer<typeof retrievalNeededInputSchema>;
export type RetrievalNeededResult = z.infer<typeof retrievalNeededResultSchema>;
export type RetrievalNeededVerdict = z.infer<typeof retrievalNeededVerdictSchema>;
