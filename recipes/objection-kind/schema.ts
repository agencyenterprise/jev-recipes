import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const objectionKindVerdictSchema = z.enum([
  'price',
  'timing',
  'authority',
  'need',
  'trust',
  'competitor',
  'none',
  'unclear',
]);
export const objectionKindInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const objectionKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: objectionKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(objectionKindVerdictSchema, probability),
});
export type ObjectionKindInput = z.infer<typeof objectionKindInputSchema>;
export type ObjectionKindResult = z.infer<typeof objectionKindResultSchema>;
export type ObjectionKindVerdict = z.infer<typeof objectionKindVerdictSchema>;
