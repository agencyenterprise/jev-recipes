import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const answerRelevanceVerdictSchema = z.enum([
  'relevant',
  'partly_relevant',
  'off_topic',
  'unclear',
]);
export const answerRelevanceInputSchema = z.object({
  request: nonEmptyText,
  draft: nonEmptyText,
  minConfidence: probability.optional(),
});
export const answerRelevanceResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: answerRelevanceVerdictSchema,
  confidence: probability,
  probabilities: z.record(answerRelevanceVerdictSchema, probability),
});
export type AnswerRelevanceInput = z.infer<typeof answerRelevanceInputSchema>;
export type AnswerRelevanceResult = z.infer<typeof answerRelevanceResultSchema>;
export type AnswerRelevanceVerdict = z.infer<typeof answerRelevanceVerdictSchema>;
