import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const routeInputSchema = z.object({
  request: nonEmptyText,
  routes: z
    .record(nonEmptyText, nonEmptyText)
    .refine(
      (routes) => Object.keys(routes).length >= 1 && Object.keys(routes).length <= 254,
      'Provide 1 to 254 routes.',
    )
    .refine((routes) => !Object.hasOwn(routes, '__review__'), '__review__ is reserved for review.'),
  minConfidence: probability.optional(),
});

export const routeResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  route: nonEmptyText.nullable(),
  suggestedRoute: nonEmptyText.nullable(),
  confidence: probability,
  probabilities: z.record(z.string(), probability),
});

export type RouteInput = z.infer<typeof routeInputSchema>;
export type RouteResult = z.infer<typeof routeResultSchema>;
