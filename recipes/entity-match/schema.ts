import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const entityMatchVerdictSchema = z.enum(['same', 'different']);

export const entityMatchInputSchema = z.object({
  firstRecord: nonEmptyText,
  secondRecord: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const entityMatchResultSchema = gateResultSchema.extend({
  verdict: entityMatchVerdictSchema,
});

export type EntityMatchVerdict = z.infer<typeof entityMatchVerdictSchema>;
export type EntityMatchInput = z.infer<typeof entityMatchInputSchema>;
export type EntityMatchResult = z.infer<typeof entityMatchResultSchema>;
