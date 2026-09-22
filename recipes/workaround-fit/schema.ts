import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const workaroundFitVerdictSchema = z.enum(['fits', 'conflicts', 'unclear']);
export const workaroundFitInputSchema = z.object({
  issue: nonEmptyText,
  workaround: nonEmptyText,
  constraints: nonEmptyText,
  minConfidence: probability.optional(),
});
export const workaroundFitResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: workaroundFitVerdictSchema,
  confidence: probability,
  probabilities: z.record(workaroundFitVerdictSchema, probability),
});
export type WorkaroundFitInput = z.infer<typeof workaroundFitInputSchema>;
export type WorkaroundFitResult = z.infer<typeof workaroundFitResultSchema>;
export type WorkaroundFitVerdict = z.infer<typeof workaroundFitVerdictSchema>;
