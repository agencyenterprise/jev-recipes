import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const topicShiftVerdictSchema = z.enum(['same_topic', 'new_topic', 'mixed', 'unclear']);
export const topicShiftInputSchema = z.object({
  currentTopic: nonEmptyText,
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const topicShiftResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: topicShiftVerdictSchema,
  confidence: probability,
  probabilities: z.record(topicShiftVerdictSchema, probability),
});
export type TopicShiftInput = z.infer<typeof topicShiftInputSchema>;
export type TopicShiftResult = z.infer<typeof topicShiftResultSchema>;
export type TopicShiftVerdict = z.infer<typeof topicShiftVerdictSchema>;
