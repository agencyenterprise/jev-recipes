import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const questionRelevanceVerdictSchema = z.enum(['relevant', 'unrelated']);

export const questionRelevanceInputSchema = z.object({
  question: nonEmptyText,
  role: nonEmptyText,
  minConfidence: probability.optional(),
});

export const questionRelevanceResultSchema = gateResultSchema.extend({
  verdict: questionRelevanceVerdictSchema,
});

export type QuestionRelevanceVerdict = z.infer<typeof questionRelevanceVerdictSchema>;
export type QuestionRelevanceInput = z.infer<typeof questionRelevanceInputSchema>;
export type QuestionRelevanceResult = z.infer<typeof questionRelevanceResultSchema>;
