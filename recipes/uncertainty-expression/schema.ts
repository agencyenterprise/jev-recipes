import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';
export const uncertaintyExpressionVerdictSchema = z.enum([
  'categorical',
  'qualified',
  'uncertain',
  'not_addressed',
  'unclear',
]);
export const uncertaintyExpressionInputSchema = z.object({
  claim: nonEmptyText.describe('One proposition whose expressed certainty should be labeled.'),
  response: nonEmptyText.describe(
    'The response whose own wording about the claim should be labeled.',
  ),
  context: nonEmptyText
    .describe('Supplied context needed to resolve references and conditions in the response.')
    .optional(),
  minConfidence: probability.optional(),
});
export const uncertaintyExpressionResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: uncertaintyExpressionVerdictSchema,
  confidence: probability,
  probabilities: z.record(uncertaintyExpressionVerdictSchema, probability),
});
export type UncertaintyExpressionInput = z.infer<typeof uncertaintyExpressionInputSchema>;
export type UncertaintyExpressionResult = z.infer<typeof uncertaintyExpressionResultSchema>;
export type UncertaintyExpressionVerdict = z.infer<typeof uncertaintyExpressionVerdictSchema>;
