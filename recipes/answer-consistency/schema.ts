import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const answerConsistencyVerdictSchema = z.enum([
  'consistent',
  'conflicting',
  'unrelated',
  'unclear',
]);
export const answerConsistencyInputSchema = z.object({
  firstStatement: nonEmptyText,
  secondStatement: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const answerConsistencyResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: answerConsistencyVerdictSchema,
  confidence: probability,
  probabilities: z.record(answerConsistencyVerdictSchema, probability),
});
export type AnswerConsistencyInput = z.infer<typeof answerConsistencyInputSchema>;
export type AnswerConsistencyResult = z.infer<typeof answerConsistencyResultSchema>;
export type AnswerConsistencyVerdict = z.infer<typeof answerConsistencyVerdictSchema>;
