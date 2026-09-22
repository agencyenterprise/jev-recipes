import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const fieldSelectInputSchema = z.object({
  field: nonEmptyText,
  document: nonEmptyText,
  candidates: textItemsSchema,
  minConfidence: probability.optional(),
});
export const fieldSelectResultSchema = selectionResultSchema;
export type FieldSelectInput = z.infer<typeof fieldSelectInputSchema>;
export type FieldSelectResult = z.infer<typeof fieldSelectResultSchema>;
