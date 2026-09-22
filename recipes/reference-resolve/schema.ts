import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const referenceResolveInputSchema = z.object({
  message: nonEmptyText,
  reference: nonEmptyText,
  candidates: textItemsSchema,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const referenceResolveResultSchema = selectionResultSchema;
export type ReferenceResolveInput = z.infer<typeof referenceResolveInputSchema>;
export type ReferenceResolveResult = z.infer<typeof referenceResolveResultSchema>;
