import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const priorityCompareVerdictSchema = comparisonVerdictSchema;
export const priorityCompareInputSchema = z.object({
  criteria: nonEmptyText,
  firstTask: nonEmptyText,
  secondTask: nonEmptyText,
  minConfidence: probability.optional(),
});
export const priorityCompareResultSchema = comparisonResultSchema;
export type PriorityCompareVerdict = z.infer<typeof priorityCompareVerdictSchema>;
export type PriorityCompareInput = z.infer<typeof priorityCompareInputSchema>;
export type PriorityCompareResult = z.infer<typeof priorityCompareResultSchema>;
