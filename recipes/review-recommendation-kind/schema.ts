import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const reviewRecommendationKindVerdictSchema = z.enum([
  'accept',
  'minor_revision',
  'major_revision',
  'reject',
  'unclear',
]);
export const reviewRecommendationKindInputSchema = z.object({
  review: nonEmptyText,
  minConfidence: probability.optional(),
});
export const reviewRecommendationKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: reviewRecommendationKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(reviewRecommendationKindVerdictSchema, probability),
});

export type ReviewRecommendationKindVerdict = z.infer<typeof reviewRecommendationKindVerdictSchema>;
export type ReviewRecommendationKindInput = z.infer<typeof reviewRecommendationKindInputSchema>;
export type ReviewRecommendationKindResult = z.infer<typeof reviewRecommendationKindResultSchema>;
