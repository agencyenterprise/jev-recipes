import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const lengthFitVerdictSchema = z.enum(['short', 'fits', 'long', 'unclear']);
export const lengthFitInputSchema = z.object({
  request: nonEmptyText,
  response: nonEmptyText,
  minConfidence: probability.optional(),
});
export const lengthFitResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: lengthFitVerdictSchema,
  confidence: probability,
  probabilities: z.record(lengthFitVerdictSchema, probability),
});
export type LengthFitInput = z.infer<typeof lengthFitInputSchema>;
export type LengthFitResult = z.infer<typeof lengthFitResultSchema>;
export type LengthFitVerdict = z.infer<typeof lengthFitVerdictSchema>;
