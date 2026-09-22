import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const draftCompareVerdictSchema = z.enum(['first', 'second', 'tie', 'neither', 'unclear']);
export const draftCompareInputSchema = z.object({
  request: nonEmptyText,
  firstDraft: nonEmptyText,
  secondDraft: nonEmptyText,
  rubric: nonEmptyText,
  minConfidence: probability.optional(),
});
export const draftCompareResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: draftCompareVerdictSchema,
  confidence: probability,
  probabilities: z.record(draftCompareVerdictSchema, probability),
});
export type DraftCompareInput = z.infer<typeof draftCompareInputSchema>;
export type DraftCompareResult = z.infer<typeof draftCompareResultSchema>;
export type DraftCompareVerdict = z.infer<typeof draftCompareVerdictSchema>;
