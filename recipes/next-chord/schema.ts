import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const nextChordInputSchema = z.object({
  progression: nonEmptyText,
  candidates: textItemsSchema,
  key: nonEmptyText.optional(),
  style: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const nextChordResultSchema = selectionResultSchema;

export type NextChordInput = z.infer<typeof nextChordInputSchema>;
export type NextChordResult = z.infer<typeof nextChordResultSchema>;
