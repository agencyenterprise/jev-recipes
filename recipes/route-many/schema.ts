import { z } from 'zod';
import { recordWithOwnKeys } from '../../src/data.js';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
  textItemSchema,
} from '../../src/schema.js';

export const routeManyInputSchema = z.object({
  requests: z
    .array(textItemSchema)
    .min(1)
    .max(500)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      'Request IDs must be unique.',
    ),
  routes: recordWithOwnKeys(nonEmptyText, nonEmptyText)
    .refine(
      (routes) => Object.keys(routes).length >= 1 && Object.keys(routes).length <= 254,
      'Provide 1 to 254 routes.',
    )
    .refine((routes) => !Object.hasOwn(routes, '__review__'), '__review__ is reserved for review.'),
  batchSize: z.number().int().min(1).max(50).optional(),
  minConfidence: probability.optional(),
});
export const routeManyItemSchema = z.object({
  id: nonEmptyText,
  status: decisionStatusSchema,
  route: nonEmptyText.nullable(),
  suggestedRoute: nonEmptyText.nullable(),
  confidence: probability,
  probabilities: recordWithOwnKeys(z.string(), probability),
});
export const routeManyResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  items: z.array(routeManyItemSchema),
  routed: z.number().int().nonnegative(),
  requestCount: z.number().int().positive(),
  requestsMade: z.number().int().positive(),
});
export type RouteManyInput = z.infer<typeof routeManyInputSchema>;
export type RouteManyItem = z.infer<typeof routeManyItemSchema>;
export type RouteManyResult = z.infer<typeof routeManyResultSchema>;
