import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const modelRouteEffortSchema = z.enum(['low', 'medium', 'high']);
export const modelRouteInputSchema = z.object({
  request: nonEmptyText,
  models: textItemsSchema,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const modelRouteResultSchema = selectionResultSchema.extend({
  effort: modelRouteEffortSchema,
  effortLevel: z.number().int().min(0).max(2),
  effortScore: z.number().min(0).max(2),
  effortConfidence: probability,
  effortProbabilities: z.record(z.string(), probability),
});
export type ModelRouteEffort = z.infer<typeof modelRouteEffortSchema>;
export type ModelRouteInput = z.infer<typeof modelRouteInputSchema>;
export type ModelRouteResult = z.infer<typeof modelRouteResultSchema>;
