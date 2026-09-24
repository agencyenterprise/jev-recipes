import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const tensionLevelVerdictSchema = z.enum(['resolved', 'low', 'moderate', 'high', 'peak']);
export const tensionLevelInputSchema = z.object({
  progression: nonEmptyText,
  key: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const tensionLevelResultSchema = scoreResultSchema.extend({
  tension: tensionLevelVerdictSchema,
});

export type TensionLevelVerdict = z.infer<typeof tensionLevelVerdictSchema>;
export type TensionLevelInput = z.infer<typeof tensionLevelInputSchema>;
export type TensionLevelResult = z.infer<typeof tensionLevelResultSchema>;
