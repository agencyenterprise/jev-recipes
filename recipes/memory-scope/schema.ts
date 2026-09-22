import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const memoryScopeVerdictSchema = z.enum(['user', 'project', 'task', 'session', 'unclear']);
export const memoryScopeInputSchema = z.object({
  fact: nonEmptyText,
  context: nonEmptyText,
  minConfidence: probability.optional(),
});
export const memoryScopeResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: memoryScopeVerdictSchema,
  confidence: probability,
  probabilities: z.record(memoryScopeVerdictSchema, probability),
});
export type MemoryScopeInput = z.infer<typeof memoryScopeInputSchema>;
export type MemoryScopeResult = z.infer<typeof memoryScopeResultSchema>;
export type MemoryScopeVerdict = z.infer<typeof memoryScopeVerdictSchema>;
