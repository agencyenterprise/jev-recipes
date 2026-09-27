import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const contactOptOutVerdictSchema = z.enum([
  'all_contact',
  'channel',
  'campaign',
  'none',
  'unclear',
]);
export const contactOptOutInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const contactOptOutResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: contactOptOutVerdictSchema,
  confidence: probability,
  probabilities: z.record(contactOptOutVerdictSchema, probability),
});

export type ContactOptOutVerdict = z.infer<typeof contactOptOutVerdictSchema>;
export type ContactOptOutInput = z.infer<typeof contactOptOutInputSchema>;
export type ContactOptOutResult = z.infer<typeof contactOptOutResultSchema>;
