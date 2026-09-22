import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const certaintyMatchVerdictSchema = z.enum([
  'overstated',
  'appropriate',
  'understated',
  'unclear',
]);
export const certaintyMatchInputSchema = z.object({
  draft: nonEmptyText,
  assessment: nonEmptyText,
  minConfidence: probability.optional(),
});
export const certaintyMatchResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: certaintyMatchVerdictSchema,
  confidence: probability,
  probabilities: z.record(certaintyMatchVerdictSchema, probability),
});
export type CertaintyMatchInput = z.infer<typeof certaintyMatchInputSchema>;
export type CertaintyMatchResult = z.infer<typeof certaintyMatchResultSchema>;
export type CertaintyMatchVerdict = z.infer<typeof certaintyMatchVerdictSchema>;
