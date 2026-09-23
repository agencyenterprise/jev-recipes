import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';
export const questionLeadingVerdictSchema = z.enum(['favors', 'disfavors', 'neutral', 'unclear']);
export const questionLeadingInputSchema = z.object({
  question: nonEmptyText.describe('One question, including any framing that the respondent sees.'),
  proposedAnswer: nonEmptyText.describe(
    'One candidate answer or position whose treatment by the question should be assessed.',
  ),
  context: nonEmptyText
    .describe('Supplied context needed to interpret references and the candidate answer.')
    .optional(),
  minConfidence: probability.optional(),
});
export const questionLeadingResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: questionLeadingVerdictSchema,
  confidence: probability,
  probabilities: z.record(questionLeadingVerdictSchema, probability),
});
export type QuestionLeadingInput = z.infer<typeof questionLeadingInputSchema>;
export type QuestionLeadingResult = z.infer<typeof questionLeadingResultSchema>;
export type QuestionLeadingVerdict = z.infer<typeof questionLeadingVerdictSchema>;
