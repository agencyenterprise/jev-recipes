import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const passageStandaloneVerdictSchema = z.enum(['standalone', 'dependent']);

export const passageStandaloneInputSchema = z.object({
  passage: nonEmptyText,
  minConfidence: probability.optional(),
});

export const passageStandaloneResultSchema = gateResultSchema.extend({
  verdict: passageStandaloneVerdictSchema,
});

export type PassageStandaloneVerdict = z.infer<typeof passageStandaloneVerdictSchema>;
export type PassageStandaloneInput = z.infer<typeof passageStandaloneInputSchema>;
export type PassageStandaloneResult = z.infer<typeof passageStandaloneResultSchema>;
