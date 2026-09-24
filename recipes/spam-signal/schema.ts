import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const spamSignalVerdictSchema = z.enum(['spam', 'genuine']);

export const spamSignalInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const spamSignalResultSchema = gateResultSchema.extend({
  verdict: spamSignalVerdictSchema,
});

export type SpamSignalVerdict = z.infer<typeof spamSignalVerdictSchema>;
export type SpamSignalInput = z.infer<typeof spamSignalInputSchema>;
export type SpamSignalResult = z.infer<typeof spamSignalResultSchema>;
