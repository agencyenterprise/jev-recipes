import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const answerInvalidationVerdictSchema = z.enum([
  'still_supported',
  'invalidated',
  'unclear',
]);
export const answerInvalidationInputSchema = z.object({
  claim: nonEmptyText,
  previousEvidence: nonEmptyText,
  updatedEvidence: nonEmptyText,
  minConfidence: probability.optional(),
});
export const answerInvalidationResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: answerInvalidationVerdictSchema,
  confidence: probability,
  probabilities: z.record(answerInvalidationVerdictSchema, probability),
});
export type AnswerInvalidationInput = z.infer<typeof answerInvalidationInputSchema>;
export type AnswerInvalidationResult = z.infer<typeof answerInvalidationResultSchema>;
export type AnswerInvalidationVerdict = z.infer<typeof answerInvalidationVerdictSchema>;
