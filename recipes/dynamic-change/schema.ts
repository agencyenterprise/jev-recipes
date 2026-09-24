import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const dynamicChangeVerdictSchema = z.enum(['softer', 'same', 'louder', 'unclear']);
export const dynamicChangeInputSchema = z.object({
  context: nonEmptyText,
  recentMaterial: nonEmptyText,
  minConfidence: probability.optional(),
});
export const dynamicChangeResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: dynamicChangeVerdictSchema,
  confidence: probability,
  probabilities: z.record(dynamicChangeVerdictSchema, probability),
});

export type DynamicChangeVerdict = z.infer<typeof dynamicChangeVerdictSchema>;
export type DynamicChangeInput = z.infer<typeof dynamicChangeInputSchema>;
export type DynamicChangeResult = z.infer<typeof dynamicChangeResultSchema>;
