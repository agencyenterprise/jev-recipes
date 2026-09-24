import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const runbookFitVerdictSchema = z.enum(['applies', 'inapplicable']);
export const runbookFitInputSchema = z.object({
  incident: nonEmptyText,
  runbook: nonEmptyText,
  minConfidence: probability.optional(),
});
export const runbookFitResultSchema = gateResultSchema.extend({ verdict: runbookFitVerdictSchema });

export type RunbookFitVerdict = z.infer<typeof runbookFitVerdictSchema>;
export type RunbookFitInput = z.infer<typeof runbookFitInputSchema>;
export type RunbookFitResult = z.infer<typeof runbookFitResultSchema>;
