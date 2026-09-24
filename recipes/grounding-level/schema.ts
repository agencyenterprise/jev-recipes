import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const groundingLevelVerdictSchema = z.enum(['none', 'weak', 'partial', 'mostly', 'full']);

export const groundingLevelInputSchema = z.object({
  draft: nonEmptyText,
  evidence: nonEmptyText,
  minConfidence: probability.optional(),
});

export const groundingLevelResultSchema = scoreResultSchema.extend({
  grounding: groundingLevelVerdictSchema,
});

export type GroundingLevelVerdict = z.infer<typeof groundingLevelVerdictSchema>;
export type GroundingLevelInput = z.infer<typeof groundingLevelInputSchema>;
export type GroundingLevelResult = z.infer<typeof groundingLevelResultSchema>;
