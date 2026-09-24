import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const narrativeConsistencyVerdictSchema = z.enum(['consistent', 'contradictory']);
export const narrativeConsistencyInputSchema = z.object({
  narrative: nonEmptyText,
  minConfidence: probability.optional(),
});
export const narrativeConsistencyResultSchema = gateResultSchema.extend({
  verdict: narrativeConsistencyVerdictSchema,
});

export type NarrativeConsistencyVerdict = z.infer<typeof narrativeConsistencyVerdictSchema>;
export type NarrativeConsistencyInput = z.infer<typeof narrativeConsistencyInputSchema>;
export type NarrativeConsistencyResult = z.infer<typeof narrativeConsistencyResultSchema>;
