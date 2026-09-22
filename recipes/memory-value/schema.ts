import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const memoryValueVerdictSchema = z.enum([
  'ongoing_value',
  'task_only',
  'incidental',
  'unclear',
]);
export const memoryValueInputSchema = z.object({
  fact: nonEmptyText,
  purpose: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const memoryValueResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: memoryValueVerdictSchema,
  confidence: probability,
  probabilities: z.record(memoryValueVerdictSchema, probability),
});
export type MemoryValueInput = z.infer<typeof memoryValueInputSchema>;
export type MemoryValueResult = z.infer<typeof memoryValueResultSchema>;
export type MemoryValueVerdict = z.infer<typeof memoryValueVerdictSchema>;
