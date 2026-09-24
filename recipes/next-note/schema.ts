import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const nextNoteInputSchema = z.object({
  recentNotes: nonEmptyText,
  candidates: textItemsSchema,
  key: nonEmptyText.optional(),
  style: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const nextNoteResultSchema = selectionResultSchema;

export type NextNoteInput = z.infer<typeof nextNoteInputSchema>;
export type NextNoteResult = z.infer<typeof nextNoteResultSchema>;
