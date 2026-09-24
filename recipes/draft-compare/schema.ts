import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const draftCompareVerdictSchema = comparisonVerdictSchema;
export const draftCompareInputSchema = z.object({
  request: nonEmptyText,
  firstDraft: nonEmptyText,
  secondDraft: nonEmptyText,
  rubric: nonEmptyText,
  minConfidence: probability.optional(),
});
export const draftCompareResultSchema = comparisonResultSchema;
export type DraftCompareInput = z.infer<typeof draftCompareInputSchema>;
export type DraftCompareResult = z.infer<typeof draftCompareResultSchema>;
export type DraftCompareVerdict = z.infer<typeof draftCompareVerdictSchema>;
