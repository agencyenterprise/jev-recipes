import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const querySpecificityVerdictSchema = z.enum(['specific', 'too_broad', 'ambiguous']);
export const querySpecificityInputSchema = z.object({
  question: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const querySpecificityResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: querySpecificityVerdictSchema,
  confidence: probability,
  probabilities: z.record(querySpecificityVerdictSchema, probability),
});
export type QuerySpecificityInput = z.infer<typeof querySpecificityInputSchema>;
export type QuerySpecificityResult = z.infer<typeof querySpecificityResultSchema>;
export type QuerySpecificityVerdict = z.infer<typeof querySpecificityVerdictSchema>;
