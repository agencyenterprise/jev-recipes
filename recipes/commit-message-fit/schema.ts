import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const commitMessageFitVerdictSchema = z.enum(['fits', 'mismatched']);

export const commitMessageFitInputSchema = z.object({
  message: nonEmptyText,
  change: nonEmptyText,
  minConfidence: probability.optional(),
});

export const commitMessageFitResultSchema = gateResultSchema.extend({
  verdict: commitMessageFitVerdictSchema,
});

export type CommitMessageFitVerdict = z.infer<typeof commitMessageFitVerdictSchema>;
export type CommitMessageFitInput = z.infer<typeof commitMessageFitInputSchema>;
export type CommitMessageFitResult = z.infer<typeof commitMessageFitResultSchema>;
