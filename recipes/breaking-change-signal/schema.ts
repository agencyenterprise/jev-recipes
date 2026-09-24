import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const breakingChangeSignalVerdictSchema = z.enum(['breaking', 'compatible']);

export const breakingChangeSignalInputSchema = z.object({
  change: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const breakingChangeSignalResultSchema = gateResultSchema.extend({
  verdict: breakingChangeSignalVerdictSchema,
});

export type BreakingChangeSignalVerdict = z.infer<typeof breakingChangeSignalVerdictSchema>;
export type BreakingChangeSignalInput = z.infer<typeof breakingChangeSignalInputSchema>;
export type BreakingChangeSignalResult = z.infer<typeof breakingChangeSignalResultSchema>;
