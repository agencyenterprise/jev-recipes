import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const disputeKindVerdictSchema = z.enum([
  'duplicate_charge',
  'wrong_amount',
  'unrecognized_charge',
  'refund_not_received',
  'cancellation_not_honored',
  'other',
  'unclear',
]);
export const disputeKindInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const disputeKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: disputeKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(disputeKindVerdictSchema, probability),
});

export type DisputeKindVerdict = z.infer<typeof disputeKindVerdictSchema>;
export type DisputeKindInput = z.infer<typeof disputeKindInputSchema>;
export type DisputeKindResult = z.infer<typeof disputeKindResultSchema>;
