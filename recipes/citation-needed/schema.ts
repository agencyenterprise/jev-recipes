import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const citationNeededVerdictSchema = z.enum(['needed', 'unnecessary', 'unclear']);
export const citationNeededInputSchema = z.object({
  statement: nonEmptyText,
  citationRules: nonEmptyText,
  minConfidence: probability.optional(),
});
export const citationNeededResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: citationNeededVerdictSchema,
  confidence: probability,
  probabilities: z.record(citationNeededVerdictSchema, probability),
});
export type CitationNeededInput = z.infer<typeof citationNeededInputSchema>;
export type CitationNeededResult = z.infer<typeof citationNeededResultSchema>;
export type CitationNeededVerdict = z.infer<typeof citationNeededVerdictSchema>;
