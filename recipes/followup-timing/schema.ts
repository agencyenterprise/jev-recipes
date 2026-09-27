import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const followupTimingVerdictSchema = z.enum([
  'now',
  'later',
  'after_event',
  'not_requested',
  'declined',
  'unclear',
]);
export const followupTimingInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const followupTimingResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: followupTimingVerdictSchema,
  confidence: probability,
  probabilities: z.record(followupTimingVerdictSchema, probability),
});

export type FollowupTimingVerdict = z.infer<typeof followupTimingVerdictSchema>;
export type FollowupTimingInput = z.infer<typeof followupTimingInputSchema>;
export type FollowupTimingResult = z.infer<typeof followupTimingResultSchema>;
