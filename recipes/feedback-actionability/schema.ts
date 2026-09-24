import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const feedbackActionabilityVerdictSchema = z.enum([
  'none',
  'vague',
  'directional',
  'specific',
  'complete',
]);

export const feedbackActionabilityInputSchema = z.object({
  feedback: nonEmptyText,
  minConfidence: probability.optional(),
});

export const feedbackActionabilityResultSchema = scoreResultSchema.extend({
  actionability: feedbackActionabilityVerdictSchema,
});

export type FeedbackActionabilityVerdict = z.infer<typeof feedbackActionabilityVerdictSchema>;
export type FeedbackActionabilityInput = z.infer<typeof feedbackActionabilityInputSchema>;
export type FeedbackActionabilityResult = z.infer<typeof feedbackActionabilityResultSchema>;
