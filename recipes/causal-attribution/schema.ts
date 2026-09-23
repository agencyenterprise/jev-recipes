import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';

export const causalAttributionVerdictSchema = z.enum([
  'personal',
  'situational',
  'mixed',
  'none',
  'unclear',
]);
export const causalAttributionInputSchema = z.object({
  behavior: nonEmptyText.describe(
    'One focal behavior or outcome identifying the person or actor whose behavior is being explained.',
  ),
  explanation: nonEmptyText.describe(
    'The supplied explanation to classify, including any quoted attribution.',
  ),
  context: nonEmptyText
    .describe('Supplied identities or references needed to interpret the explanation.')
    .optional(),
  minConfidence: probability.optional(),
});
export const causalAttributionResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: causalAttributionVerdictSchema,
  confidence: probability,
  probabilities: z.record(causalAttributionVerdictSchema, probability),
});
export type CausalAttributionInput = z.infer<typeof causalAttributionInputSchema>;
export type CausalAttributionResult = z.infer<typeof causalAttributionResultSchema>;
export type CausalAttributionVerdict = z.infer<typeof causalAttributionVerdictSchema>;
