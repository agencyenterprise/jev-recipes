import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const freshnessNeededVerdictSchema = z.enum(['current', 'stable', 'unclear']);
export const freshnessNeededInputSchema = z.object({
  question: nonEmptyText,
  minConfidence: probability.optional(),
});
export const freshnessNeededResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: freshnessNeededVerdictSchema,
  confidence: probability,
  probabilities: z.record(freshnessNeededVerdictSchema, probability),
});
export type FreshnessNeededInput = z.infer<typeof freshnessNeededInputSchema>;
export type FreshnessNeededResult = z.infer<typeof freshnessNeededResultSchema>;
export type FreshnessNeededVerdict = z.infer<typeof freshnessNeededVerdictSchema>;
