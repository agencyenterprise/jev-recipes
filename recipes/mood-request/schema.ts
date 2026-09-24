import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const moodRequestVerdictSchema = z.enum([
  'happy',
  'sad',
  'calm',
  'energetic',
  'tense',
  'romantic',
  'unclear',
]);
export const moodRequestInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const moodRequestResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: moodRequestVerdictSchema,
  confidence: probability,
  probabilities: z.record(moodRequestVerdictSchema, probability),
});

export type MoodRequestVerdict = z.infer<typeof moodRequestVerdictSchema>;
export type MoodRequestInput = z.infer<typeof moodRequestInputSchema>;
export type MoodRequestResult = z.infer<typeof moodRequestResultSchema>;
