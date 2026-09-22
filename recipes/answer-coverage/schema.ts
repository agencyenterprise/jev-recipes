import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const answerCoverageVerdictSchema = z.enum(['answered', 'partial', 'missing', 'unclear']);
export const answerCoverageInputSchema = z.object({
  draft: nonEmptyText,
  questions: textItemsSchema,
  minConfidence: probability.optional(),
});
export const answerCoverageResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  allAnswered: z.boolean(),
  checks: z
    .array(
      z.object({
        id: nonEmptyText,
        status: decisionStatusSchema,
        verdict: answerCoverageVerdictSchema,
        confidence: probability,
        probabilities: z.record(answerCoverageVerdictSchema, probability),
      }),
    )
    .min(1)
    .max(50),
});
export type AnswerCoverageInput = z.infer<typeof answerCoverageInputSchema>;
export type AnswerCoverageResult = z.infer<typeof answerCoverageResultSchema>;
export type AnswerCoverageVerdict = z.infer<typeof answerCoverageVerdictSchema>;
