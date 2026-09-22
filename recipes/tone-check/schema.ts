import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const toneCheckVerdictSchema = z.enum(['pass', 'fail', 'unclear']);
export const toneCheckInputSchema = z.object({
  draft: nonEmptyText,
  criteria: textItemsSchema,
  minConfidence: probability.optional(),
});
export const toneCheckResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  allPassed: z.boolean(),
  checks: z
    .array(
      z.object({
        id: nonEmptyText,
        status: decisionStatusSchema,
        verdict: toneCheckVerdictSchema,
        confidence: probability,
        probabilities: z.record(toneCheckVerdictSchema, probability),
      }),
    )
    .min(1)
    .max(50),
});
export type ToneCheckInput = z.infer<typeof toneCheckInputSchema>;
export type ToneCheckResult = z.infer<typeof toneCheckResultSchema>;
export type ToneCheckVerdict = z.infer<typeof toneCheckVerdictSchema>;
