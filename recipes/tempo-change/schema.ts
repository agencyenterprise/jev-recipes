import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const tempoChangeVerdictSchema = z.enum(['slower', 'same', 'faster', 'unclear']);
export const tempoChangeInputSchema = z.object({
  context: nonEmptyText,
  recentMaterial: nonEmptyText,
  minConfidence: probability.optional(),
});
export const tempoChangeResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: tempoChangeVerdictSchema,
  confidence: probability,
  probabilities: z.record(tempoChangeVerdictSchema, probability),
});

export type TempoChangeVerdict = z.infer<typeof tempoChangeVerdictSchema>;
export type TempoChangeInput = z.infer<typeof tempoChangeInputSchema>;
export type TempoChangeResult = z.infer<typeof tempoChangeResultSchema>;
