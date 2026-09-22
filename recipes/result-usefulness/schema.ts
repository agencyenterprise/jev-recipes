import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const resultUsefulnessVerdictSchema = z.enum([
  'useful',
  'no_useful_information',
  'irrelevant',
  'unclear',
]);
export const resultUsefulnessInputSchema = z.object({
  task: nonEmptyText,
  result: nonEmptyText,
  minConfidence: probability.optional(),
});
export const resultUsefulnessResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: resultUsefulnessVerdictSchema,
  confidence: probability,
  probabilities: z.record(resultUsefulnessVerdictSchema, probability),
});
export type ResultUsefulnessInput = z.infer<typeof resultUsefulnessInputSchema>;
export type ResultUsefulnessResult = z.infer<typeof resultUsefulnessResultSchema>;
export type ResultUsefulnessVerdict = z.infer<typeof resultUsefulnessVerdictSchema>;
