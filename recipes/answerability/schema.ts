import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const answerabilityVerdictSchema = z.enum([
  'sufficient',
  'partial',
  'insufficient',
  'conflicting',
]);
export const answerabilityEvidenceSchema = z.object({ id: nonEmptyText, text: nonEmptyText });
export const answerabilityInputSchema = z.object({
  question: nonEmptyText,
  evidence: z
    .array(answerabilityEvidenceSchema)
    .min(1)
    .max(50)
    .refine(
      (evidence) => new Set(evidence.map((item) => item.id)).size === evidence.length,
      'Evidence IDs must be unique.',
    ),
  minConfidence: probability.optional(),
});
export const answerabilityResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: answerabilityVerdictSchema,
  canAnswer: z.boolean(),
  confidence: probability,
  probabilities: z.record(answerabilityVerdictSchema, probability),
});
export type AnswerabilityInput = z.infer<typeof answerabilityInputSchema>;
export type AnswerabilityResult = z.infer<typeof answerabilityResultSchema>;
export type AnswerabilityVerdict = z.infer<typeof answerabilityVerdictSchema>;
