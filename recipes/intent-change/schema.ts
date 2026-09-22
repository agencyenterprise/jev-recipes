import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const intentChangeVerdictSchema = z.enum(['continues', 'refines', 'replaces', 'unclear']);
export const intentChangeInputSchema = z.object({
  currentGoal: nonEmptyText,
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const intentChangeResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: intentChangeVerdictSchema,
  confidence: probability,
  probabilities: z.record(intentChangeVerdictSchema, probability),
});
export type IntentChangeInput = z.infer<typeof intentChangeInputSchema>;
export type IntentChangeResult = z.infer<typeof intentChangeResultSchema>;
export type IntentChangeVerdict = z.infer<typeof intentChangeVerdictSchema>;
