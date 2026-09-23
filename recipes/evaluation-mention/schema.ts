import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';
export const evaluationMentionVerdictSchema = z.enum([
  'self_reference',
  'discussion',
  'none',
  'unclear',
]);
export const evaluationMentionInputSchema = z.object({
  response: nonEmptyText.describe(
    'The response to inspect for explicit references to evaluation of an AI response or model.',
  ),
  context: nonEmptyText
    .describe('Surrounding text used only to resolve who or what the response refers to.')
    .optional(),
  minConfidence: probability.optional(),
});
export const evaluationMentionResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: evaluationMentionVerdictSchema,
  confidence: probability,
  probabilities: z.record(evaluationMentionVerdictSchema, probability),
});
export type EvaluationMentionInput = z.infer<typeof evaluationMentionInputSchema>;
export type EvaluationMentionResult = z.infer<typeof evaluationMentionResultSchema>;
export type EvaluationMentionVerdict = z.infer<typeof evaluationMentionVerdictSchema>;
