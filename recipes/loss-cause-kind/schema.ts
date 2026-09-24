import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const lossCauseKindVerdictSchema = z.enum([
  'weather',
  'fire',
  'water',
  'theft',
  'collision',
  'wear_and_tear',
  'vandalism',
  'other',
  'unclear',
]);
export const lossCauseKindInputSchema = z.object({
  narrative: nonEmptyText,
  minConfidence: probability.optional(),
});
export const lossCauseKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: lossCauseKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(lossCauseKindVerdictSchema, probability),
});

export type LossCauseKindVerdict = z.infer<typeof lossCauseKindVerdictSchema>;
export type LossCauseKindInput = z.infer<typeof lossCauseKindInputSchema>;
export type LossCauseKindResult = z.infer<typeof lossCauseKindResultSchema>;
