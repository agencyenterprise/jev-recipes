import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const summaryCoverageVerdictSchema = z.enum(['preserved', 'partial', 'missing', 'unclear']);
export const summaryCoverageInputSchema = z.object({
  summary: nonEmptyText,
  points: textItemsSchema,
  minConfidence: probability.optional(),
});
export const summaryCoverageResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  allPreserved: z.boolean(),
  checks: z
    .array(
      z.object({
        id: nonEmptyText,
        status: decisionStatusSchema,
        verdict: summaryCoverageVerdictSchema,
        confidence: probability,
        probabilities: z.record(summaryCoverageVerdictSchema, probability),
      }),
    )
    .min(1)
    .max(50),
});
export type SummaryCoverageInput = z.infer<typeof summaryCoverageInputSchema>;
export type SummaryCoverageResult = z.infer<typeof summaryCoverageResultSchema>;
export type SummaryCoverageVerdict = z.infer<typeof summaryCoverageVerdictSchema>;
