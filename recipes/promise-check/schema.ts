import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const promiseCheckVerdictSchema = z.enum(['within_commitments', 'unsupported', 'unclear']);
export const promiseCheckInputSchema = z.object({
  reply: nonEmptyText,
  allowedCommitments: nonEmptyText,
  minConfidence: probability.optional(),
});
export const promiseCheckResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: promiseCheckVerdictSchema,
  confidence: probability,
  probabilities: z.record(promiseCheckVerdictSchema, probability),
});
export type PromiseCheckInput = z.infer<typeof promiseCheckInputSchema>;
export type PromiseCheckResult = z.infer<typeof promiseCheckResultSchema>;
export type PromiseCheckVerdict = z.infer<typeof promiseCheckVerdictSchema>;
