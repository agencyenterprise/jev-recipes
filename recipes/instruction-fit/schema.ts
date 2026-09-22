import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const instructionFitVerdictSchema = z.enum(['applies', 'does_not_apply', 'unclear']);
export const instructionFitInputSchema = z.object({
  instruction: nonEmptyText,
  task: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const instructionFitResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: instructionFitVerdictSchema,
  confidence: probability,
  probabilities: z.record(instructionFitVerdictSchema, probability),
});
export type InstructionFitInput = z.infer<typeof instructionFitInputSchema>;
export type InstructionFitResult = z.infer<typeof instructionFitResultSchema>;
export type InstructionFitVerdict = z.infer<typeof instructionFitVerdictSchema>;
