import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const changeMeaningVerdictSchema = z.enum(['meaning_changed', 'editorial_only', 'unclear']);
export const changeMeaningInputSchema = z.object({
  before: nonEmptyText,
  after: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const changeMeaningResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: changeMeaningVerdictSchema,
  confidence: probability,
  probabilities: z.record(changeMeaningVerdictSchema, probability),
});
export type ChangeMeaningInput = z.infer<typeof changeMeaningInputSchema>;
export type ChangeMeaningResult = z.infer<typeof changeMeaningResultSchema>;
export type ChangeMeaningVerdict = z.infer<typeof changeMeaningVerdictSchema>;
