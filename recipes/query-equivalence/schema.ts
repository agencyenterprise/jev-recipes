import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const queryEquivalenceVerdictSchema = z.enum([
  'equivalent',
  'related',
  'different',
  'unclear',
]);
export const queryEquivalenceInputSchema = z.object({
  firstQuestion: nonEmptyText,
  secondQuestion: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const queryEquivalenceResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: queryEquivalenceVerdictSchema,
  confidence: probability,
  probabilities: z.record(queryEquivalenceVerdictSchema, probability),
});
export type QueryEquivalenceInput = z.infer<typeof queryEquivalenceInputSchema>;
export type QueryEquivalenceResult = z.infer<typeof queryEquivalenceResultSchema>;
export type QueryEquivalenceVerdict = z.infer<typeof queryEquivalenceVerdictSchema>;
