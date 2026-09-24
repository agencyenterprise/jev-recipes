import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const clauseKindVerdictSchema = z.enum([
  'obligation',
  'right',
  'prohibition',
  'condition',
  'definition',
  'unclear',
]);
export const clauseKindInputSchema = z.object({
  clause: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const clauseKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: clauseKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(clauseKindVerdictSchema, probability),
});
export type ClauseKindInput = z.infer<typeof clauseKindInputSchema>;
export type ClauseKindResult = z.infer<typeof clauseKindResultSchema>;
export type ClauseKindVerdict = z.infer<typeof clauseKindVerdictSchema>;
