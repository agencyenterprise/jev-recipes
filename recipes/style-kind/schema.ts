import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const styleKindVerdictSchema = z.enum([
  'classical',
  'jazz',
  'blues',
  'pop',
  'electronic',
  'folk',
  'unclear',
]);
export const styleKindInputSchema = z.object({
  description: nonEmptyText,
  minConfidence: probability.optional(),
});
export const styleKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: styleKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(styleKindVerdictSchema, probability),
});

export type StyleKindVerdict = z.infer<typeof styleKindVerdictSchema>;
export type StyleKindInput = z.infer<typeof styleKindInputSchema>;
export type StyleKindResult = z.infer<typeof styleKindResultSchema>;
