import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const responseNeededVerdictSchema = z.enum(['reply_needed', 'no_reply_needed', 'unclear']);
export const responseNeededInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const responseNeededResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: responseNeededVerdictSchema,
  confidence: probability,
  probabilities: z.record(responseNeededVerdictSchema, probability),
});
export type ResponseNeededInput = z.infer<typeof responseNeededInputSchema>;
export type ResponseNeededResult = z.infer<typeof responseNeededResultSchema>;
export type ResponseNeededVerdict = z.infer<typeof responseNeededVerdictSchema>;
