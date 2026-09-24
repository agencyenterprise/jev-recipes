import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const emotionKindVerdictSchema = z.enum([
  'joy',
  'anger',
  'sadness',
  'fear',
  'surprise',
  'neutral',
  'unclear',
]);
export const emotionKindInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const emotionKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: emotionKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(emotionKindVerdictSchema, probability),
});
export type EmotionKindInput = z.infer<typeof emotionKindInputSchema>;
export type EmotionKindResult = z.infer<typeof emotionKindResultSchema>;
export type EmotionKindVerdict = z.infer<typeof emotionKindVerdictSchema>;
