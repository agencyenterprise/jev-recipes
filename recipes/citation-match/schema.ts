import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
  textItemsSchema,
} from '../../src/schema.js';
import { verifyResultSchema } from '../verify/index.js';

export const citationMatchInputSchema = z.object({
  claim: nonEmptyText,
  passages: textItemsSchema,
  minConfidence: probability.optional(),
});
export const citationMatchResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  passageIds: z.array(nonEmptyText),
  checks: verifyResultSchema.shape.checks,
});
export type CitationMatchInput = z.infer<typeof citationMatchInputSchema>;
export type CitationMatchResult = z.infer<typeof citationMatchResultSchema>;
