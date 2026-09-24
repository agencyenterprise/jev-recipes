import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const intakeQuestionFitVerdictSchema = z.enum(['fits', 'overreaches']);
export const intakeQuestionFitInputSchema = z.object({
  question: nonEmptyText,
  purpose: nonEmptyText,
  minConfidence: probability.optional(),
});
export const intakeQuestionFitResultSchema = gateResultSchema.extend({
  verdict: intakeQuestionFitVerdictSchema,
});

export type IntakeQuestionFitVerdict = z.infer<typeof intakeQuestionFitVerdictSchema>;
export type IntakeQuestionFitInput = z.infer<typeof intakeQuestionFitInputSchema>;
export type IntakeQuestionFitResult = z.infer<typeof intakeQuestionFitResultSchema>;
