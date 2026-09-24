import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const passageCompareVerdictSchema = comparisonVerdictSchema;
export const passageCompareInputSchema = z.object({
  question: nonEmptyText,
  firstPassage: nonEmptyText,
  secondPassage: nonEmptyText,
  minConfidence: probability.optional(),
});
export const passageCompareResultSchema = comparisonResultSchema;
export type PassageCompareVerdict = z.infer<typeof passageCompareVerdictSchema>;
export type PassageCompareInput = z.infer<typeof passageCompareInputSchema>;
export type PassageCompareResult = z.infer<typeof passageCompareResultSchema>;
