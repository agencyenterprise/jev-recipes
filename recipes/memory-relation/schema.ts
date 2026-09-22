import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const memoryRelationVerdictSchema = z.enum([
  'repeats',
  'supplements',
  'updates',
  'conflicts',
  'unrelated',
  'unclear',
]);
export const memoryRelationInputSchema = z.object({
  existingMemory: nonEmptyText,
  newFact: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const memoryRelationResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: memoryRelationVerdictSchema,
  confidence: probability,
  probabilities: z.record(memoryRelationVerdictSchema, probability),
});
export type MemoryRelationInput = z.infer<typeof memoryRelationInputSchema>;
export type MemoryRelationResult = z.infer<typeof memoryRelationResultSchema>;
export type MemoryRelationVerdict = z.infer<typeof memoryRelationVerdictSchema>;
