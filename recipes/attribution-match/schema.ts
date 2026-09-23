import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';
export const attributionMatchVerdictSchema = z.enum([
  'matched',
  'mismatched',
  'not_attributed',
  'unclear',
]);
export const attributionMatchInputSchema = z.object({
  statement: nonEmptyText.describe(
    'One statement or faithful paraphrase whose attributed speaker or source should be checked.',
  ),
  attributedTo: nonEmptyText.describe(
    'The speaker or source claimed to have made or explicitly endorsed the statement.',
  ),
  source: nonEmptyText.describe(
    'The supplied transcript or excerpt, including speaker labels or attribution context needed to check the claim.',
  ),
  minConfidence: probability.optional(),
});
export const attributionMatchResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: attributionMatchVerdictSchema,
  confidence: probability,
  probabilities: z.record(attributionMatchVerdictSchema, probability),
});
export type AttributionMatchInput = z.infer<typeof attributionMatchInputSchema>;
export type AttributionMatchResult = z.infer<typeof attributionMatchResultSchema>;
export type AttributionMatchVerdict = z.infer<typeof attributionMatchVerdictSchema>;
