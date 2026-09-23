import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';

export const questionAssumptionVerdictSchema = z.enum(['assumed', 'not_assumed', 'unclear']);
export const questionAssumptionInputSchema = z.object({
  question: nonEmptyText.describe('One question, including any framing visible to the respondent.'),
  claim: nonEmptyText.describe(
    'One specific proposition to check for an assumption in the question.',
  ),
  context: nonEmptyText
    .describe('Supplied context needed to resolve references and interpret the question and claim.')
    .optional(),
  minConfidence: probability.optional(),
});
export const questionAssumptionResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: questionAssumptionVerdictSchema,
  confidence: probability,
  probabilities: z.record(questionAssumptionVerdictSchema, probability),
});
export type QuestionAssumptionInput = z.infer<typeof questionAssumptionInputSchema>;
export type QuestionAssumptionResult = z.infer<typeof questionAssumptionResultSchema>;
export type QuestionAssumptionVerdict = z.infer<typeof questionAssumptionVerdictSchema>;
