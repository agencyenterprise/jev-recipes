import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const ticketMatchVerdictSchema = z.enum(['same_issue', 'related', 'different', 'unclear']);
export const ticketMatchInputSchema = z.object({
  firstTicket: nonEmptyText,
  secondTicket: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const ticketMatchResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: ticketMatchVerdictSchema,
  confidence: probability,
  probabilities: z.record(ticketMatchVerdictSchema, probability),
});
export type TicketMatchInput = z.infer<typeof ticketMatchInputSchema>;
export type TicketMatchResult = z.infer<typeof ticketMatchResultSchema>;
export type TicketMatchVerdict = z.infer<typeof ticketMatchVerdictSchema>;
