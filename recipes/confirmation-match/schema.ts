import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const confirmationMatchVerdictSchema = z.enum(['agrees', 'rejects', 'unclear']);
export const confirmationMatchInputSchema = z.object({
  proposal: nonEmptyText,
  response: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const confirmationMatchResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: confirmationMatchVerdictSchema,
  confidence: probability,
  probabilities: z.record(confirmationMatchVerdictSchema, probability),
});
export type ConfirmationMatchInput = z.infer<typeof confirmationMatchInputSchema>;
export type ConfirmationMatchResult = z.infer<typeof confirmationMatchResultSchema>;
export type ConfirmationMatchVerdict = z.infer<typeof confirmationMatchVerdictSchema>;
