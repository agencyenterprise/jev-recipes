import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const toolCompareVerdictSchema = comparisonVerdictSchema;
export const toolCompareInputSchema = z.object({
  task: nonEmptyText,
  firstTool: nonEmptyText,
  secondTool: nonEmptyText,
  minConfidence: probability.optional(),
});
export const toolCompareResultSchema = comparisonResultSchema;

export type ToolCompareVerdict = z.infer<typeof toolCompareVerdictSchema>;
export type ToolCompareInput = z.infer<typeof toolCompareInputSchema>;
export type ToolCompareResult = z.infer<typeof toolCompareResultSchema>;
