import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const feedbackKindVerdictSchema = z.enum([
  'bug_report',
  'feature_request',
  'question',
  'praise',
  'complaint',
  'other',
  'unclear',
]);
export const feedbackKindInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const feedbackKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: feedbackKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(feedbackKindVerdictSchema, probability),
});
export type FeedbackKindInput = z.infer<typeof feedbackKindInputSchema>;
export type FeedbackKindResult = z.infer<typeof feedbackKindResultSchema>;
export type FeedbackKindVerdict = z.infer<typeof feedbackKindVerdictSchema>;
