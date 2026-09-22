import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const toolFitVerdictSchema = z.enum(['fits', 'does_not_fit', 'unclear']);
export const toolFitInputSchema = z.object({
  task: nonEmptyText,
  tool: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const toolFitResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: toolFitVerdictSchema,
  confidence: probability,
  probabilities: z.record(toolFitVerdictSchema, probability),
});
export type ToolFitInput = z.infer<typeof toolFitInputSchema>;
export type ToolFitResult = z.infer<typeof toolFitResultSchema>;
export type ToolFitVerdict = z.infer<typeof toolFitVerdictSchema>;
