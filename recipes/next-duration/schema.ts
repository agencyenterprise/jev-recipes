import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const nextDurationInputSchema = z.object({
  meter: nonEmptyText,
  recentRhythm: nonEmptyText,
  candidates: textItemsSchema,
  style: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const nextDurationResultSchema = selectionResultSchema;

export type NextDurationInput = z.infer<typeof nextDurationInputSchema>;
export type NextDurationResult = z.infer<typeof nextDurationResultSchema>;
