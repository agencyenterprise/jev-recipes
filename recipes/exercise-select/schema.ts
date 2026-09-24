import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const exerciseSelectInputSchema = z.object({
  feedback: nonEmptyText,
  candidates: textItemsSchema,
  goal: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const exerciseSelectResultSchema = selectionResultSchema;

export type ExerciseSelectInput = z.infer<typeof exerciseSelectInputSchema>;
export type ExerciseSelectResult = z.infer<typeof exerciseSelectResultSchema>;
