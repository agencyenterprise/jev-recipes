import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const slotFitVerdictSchema = z.enum(['fits', 'violates']);

export const slotFitInputSchema = z.object({
  proposal: nonEmptyText,
  constraints: nonEmptyText,
  minConfidence: probability.optional(),
});

export const slotFitResultSchema = gateResultSchema.extend({
  verdict: slotFitVerdictSchema,
});

export type SlotFitVerdict = z.infer<typeof slotFitVerdictSchema>;
export type SlotFitInput = z.infer<typeof slotFitInputSchema>;
export type SlotFitResult = z.infer<typeof slotFitResultSchema>;
