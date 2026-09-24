import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const actionCompareVerdictSchema = comparisonVerdictSchema;
export const actionCompareInputSchema = z.object({
  goal: nonEmptyText,
  firstAction: nonEmptyText,
  secondAction: nonEmptyText,
  constraints: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const actionCompareResultSchema = comparisonResultSchema;
export type ActionCompareVerdict = z.infer<typeof actionCompareVerdictSchema>;
export type ActionCompareInput = z.infer<typeof actionCompareInputSchema>;
export type ActionCompareResult = z.infer<typeof actionCompareResultSchema>;
