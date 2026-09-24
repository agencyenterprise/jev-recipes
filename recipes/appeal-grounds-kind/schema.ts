import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const appealGroundsKindVerdictSchema = z.enum([
  'factual_error',
  'procedural_error',
  'new_evidence',
  'hardship',
  'misapplied_rule',
  'other',
  'unclear',
]);
export const appealGroundsKindInputSchema = z.object({
  appeal: nonEmptyText,
  minConfidence: probability.optional(),
});
export const appealGroundsKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: appealGroundsKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(appealGroundsKindVerdictSchema, probability),
});

export type AppealGroundsKindVerdict = z.infer<typeof appealGroundsKindVerdictSchema>;
export type AppealGroundsKindInput = z.infer<typeof appealGroundsKindInputSchema>;
export type AppealGroundsKindResult = z.infer<typeof appealGroundsKindResultSchema>;
