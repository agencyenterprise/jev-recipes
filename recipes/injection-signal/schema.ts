import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const injectionSignalVerdictSchema = z.enum(['present', 'absent']);

export const injectionSignalInputSchema = z.object({
  text: nonEmptyText,
  minConfidence: probability.optional(),
});

export const injectionSignalResultSchema = gateResultSchema.extend({
  verdict: injectionSignalVerdictSchema,
});

export type InjectionSignalVerdict = z.infer<typeof injectionSignalVerdictSchema>;
export type InjectionSignalInput = z.infer<typeof injectionSignalInputSchema>;
export type InjectionSignalResult = z.infer<typeof injectionSignalResultSchema>;
