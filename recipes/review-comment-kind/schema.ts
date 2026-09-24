import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const reviewCommentKindVerdictSchema = z.enum([
  'bug',
  'design',
  'style',
  'question',
  'nit',
  'praise',
  'unclear',
]);
export const reviewCommentKindInputSchema = z.object({
  comment: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const reviewCommentKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: reviewCommentKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(reviewCommentKindVerdictSchema, probability),
});
export type ReviewCommentKindInput = z.infer<typeof reviewCommentKindInputSchema>;
export type ReviewCommentKindResult = z.infer<typeof reviewCommentKindResultSchema>;
export type ReviewCommentKindVerdict = z.infer<typeof reviewCommentKindVerdictSchema>;
