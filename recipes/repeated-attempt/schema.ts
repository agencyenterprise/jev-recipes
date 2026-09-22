import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const repeatedAttemptVerdictSchema = z.enum([
  'same_approach',
  'different_approach',
  'unclear',
]);
export const repeatedAttemptInputSchema = z.object({
  objective: nonEmptyText,
  previousAttempt: nonEmptyText,
  proposedAttempt: nonEmptyText,
  minConfidence: probability.optional(),
});
export const repeatedAttemptResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: repeatedAttemptVerdictSchema,
  confidence: probability,
  probabilities: z.record(repeatedAttemptVerdictSchema, probability),
});
export type RepeatedAttemptInput = z.infer<typeof repeatedAttemptInputSchema>;
export type RepeatedAttemptResult = z.infer<typeof repeatedAttemptResultSchema>;
export type RepeatedAttemptVerdict = z.infer<typeof repeatedAttemptVerdictSchema>;
