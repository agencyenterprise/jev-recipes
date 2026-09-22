import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const failureKindInputSchema = z.object({
  failure: nonEmptyText,
  categories: textItemsSchema,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const failureKindResultSchema = selectionResultSchema;
export type FailureKindInput = z.infer<typeof failureKindInputSchema>;
export type FailureKindResult = z.infer<typeof failureKindResultSchema>;
