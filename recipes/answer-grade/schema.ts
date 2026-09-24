import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const answerGradeVerdictSchema = z.enum(['none', 'minimal', 'partial', 'mostly', 'full']);

export const answerGradeInputSchema = z.object({
  question: nonEmptyText,
  answer: nonEmptyText,
  rubric: nonEmptyText,
  minConfidence: probability.optional(),
});

export const answerGradeResultSchema = scoreResultSchema.extend({
  grade: answerGradeVerdictSchema,
});

export type AnswerGradeVerdict = z.infer<typeof answerGradeVerdictSchema>;
export type AnswerGradeInput = z.infer<typeof answerGradeInputSchema>;
export type AnswerGradeResult = z.infer<typeof answerGradeResultSchema>;
