import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const shipmentIssueKindVerdictSchema = z.enum([
  'delayed',
  'damaged',
  'lost',
  'wrong_item',
  'address',
  'none',
  'unclear',
]);
export const shipmentIssueKindInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const shipmentIssueKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: shipmentIssueKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(shipmentIssueKindVerdictSchema, probability),
});
export type ShipmentIssueKindInput = z.infer<typeof shipmentIssueKindInputSchema>;
export type ShipmentIssueKindResult = z.infer<typeof shipmentIssueKindResultSchema>;
export type ShipmentIssueKindVerdict = z.infer<typeof shipmentIssueKindVerdictSchema>;
