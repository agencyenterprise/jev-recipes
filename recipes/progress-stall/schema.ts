import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const progressStallVerdictSchema = z.enum(['stalled', 'progressing']);

export const progressStallInputSchema = z.object({
  transcript: nonEmptyText,
  objective: nonEmptyText,
  minConfidence: probability.optional(),
});

export const progressStallResultSchema = gateResultSchema.extend({
  verdict: progressStallVerdictSchema,
});

export type ProgressStallVerdict = z.infer<typeof progressStallVerdictSchema>;
export type ProgressStallInput = z.infer<typeof progressStallInputSchema>;
export type ProgressStallResult = z.infer<typeof progressStallResultSchema>;
