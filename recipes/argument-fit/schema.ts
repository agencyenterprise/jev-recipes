import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const argumentFitVerdictSchema = z.enum(['fits', 'conflicts', 'unclear']);
export const argumentFitInputSchema = z.object({
  request: nonEmptyText,
  argument: nonEmptyText,
  proposedValue: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const argumentFitResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: argumentFitVerdictSchema,
  confidence: probability,
  probabilities: z.record(argumentFitVerdictSchema, probability),
});
export type ArgumentFitInput = z.infer<typeof argumentFitInputSchema>;
export type ArgumentFitResult = z.infer<typeof argumentFitResultSchema>;
export type ArgumentFitVerdict = z.infer<typeof argumentFitVerdictSchema>;
