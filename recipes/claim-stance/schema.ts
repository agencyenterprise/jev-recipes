import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const claimStanceVerdictSchema = z.enum([
  'affirms',
  'denies',
  'mixed',
  'not_addressed',
  'unclear',
]);
export const claimStanceInputSchema = z.object({
  claim: nonEmptyText.describe(
    'One proposition whose stance should be labeled; its truth is evaluated separately.',
  ),
  response: nonEmptyText.describe('The response whose expressed position should be labeled.'),
  context: nonEmptyText
    .describe('Supplied context needed to resolve references in the response.')
    .optional(),
  minConfidence: probability.optional(),
});
export const claimStanceResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: claimStanceVerdictSchema,
  confidence: probability,
  probabilities: z.record(claimStanceVerdictSchema, probability),
});
export type ClaimStanceInput = z.infer<typeof claimStanceInputSchema>;
export type ClaimStanceResult = z.infer<typeof claimStanceResultSchema>;
export type ClaimStanceVerdict = z.infer<typeof claimStanceVerdictSchema>;
