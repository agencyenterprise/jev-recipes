import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  selectionResultSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const correctionTargetInputSchema = z.object({
  message: nonEmptyText,
  targets: textItemsSchema,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const correctionTargetResultSchema = selectionResultSchema;
export type CorrectionTargetInput = z.infer<typeof correctionTargetInputSchema>;
export type CorrectionTargetResult = z.infer<typeof correctionTargetResultSchema>;
