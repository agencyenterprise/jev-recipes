import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';
export const responseRefusalVerdictSchema = z.enum([
  'refused',
  'attempted',
  'mixed',
  'unable',
  'not_addressed',
  'unclear',
]);
export const responseRefusalInputSchema = z.object({
  request: nonEmptyText.describe('One bounded request against which to label the response.'),
  response: nonEmptyText.describe('The response to inspect for refusal and attempted fulfillment.'),
  context: nonEmptyText
    .describe('Only the surrounding text needed to resolve references or the scope of the request.')
    .optional(),
  minConfidence: probability.optional(),
});
export const responseRefusalResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: responseRefusalVerdictSchema,
  confidence: probability,
  probabilities: z.record(responseRefusalVerdictSchema, probability),
});
export type ResponseRefusalInput = z.infer<typeof responseRefusalInputSchema>;
export type ResponseRefusalResult = z.infer<typeof responseRefusalResultSchema>;
export type ResponseRefusalVerdict = z.infer<typeof responseRefusalVerdictSchema>;
