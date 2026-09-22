import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const resultOutcomeVerdictSchema = z.enum([
  'success',
  'partial_success',
  'failure',
  'unclear',
]);
export const resultOutcomeInputSchema = z.object({
  task: nonEmptyText,
  result: nonEmptyText,
  minConfidence: probability.optional(),
});
export const resultOutcomeResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: resultOutcomeVerdictSchema,
  confidence: probability,
  probabilities: z.record(resultOutcomeVerdictSchema, probability),
});
export type ResultOutcomeInput = z.infer<typeof resultOutcomeInputSchema>;
export type ResultOutcomeResult = z.infer<typeof resultOutcomeResultSchema>;
export type ResultOutcomeVerdict = z.infer<typeof resultOutcomeVerdictSchema>;
