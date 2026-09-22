import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const attemptedStepVerdictSchema = z.enum(['tried', 'not_tried', 'unclear']);
export const attemptedStepInputSchema = z.object({
  step: nonEmptyText,
  conversation: nonEmptyText,
  minConfidence: probability.optional(),
});
export const attemptedStepResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: attemptedStepVerdictSchema,
  confidence: probability,
  probabilities: z.record(attemptedStepVerdictSchema, probability),
});
export type AttemptedStepInput = z.infer<typeof attemptedStepInputSchema>;
export type AttemptedStepResult = z.infer<typeof attemptedStepResultSchema>;
export type AttemptedStepVerdict = z.infer<typeof attemptedStepVerdictSchema>;
