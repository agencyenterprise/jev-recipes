import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const modulationMomentVerdictSchema = z.enum(['suitable', 'unsuitable']);
export const modulationMomentInputSchema = z.object({
  recentMaterial: nonEmptyText,
  key: nonEmptyText,
  minConfidence: probability.optional(),
});
export const modulationMomentResultSchema = gateResultSchema.extend({
  verdict: modulationMomentVerdictSchema,
});

export type ModulationMomentVerdict = z.infer<typeof modulationMomentVerdictSchema>;
export type ModulationMomentInput = z.infer<typeof modulationMomentInputSchema>;
export type ModulationMomentResult = z.infer<typeof modulationMomentResultSchema>;
