import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const instructionPriorityVerdictSchema = comparisonVerdictSchema;
export const instructionPriorityInputSchema = z.object({
  policy: nonEmptyText,
  firstInstruction: nonEmptyText,
  secondInstruction: nonEmptyText,
  minConfidence: probability.optional(),
});
export const instructionPriorityResultSchema = comparisonResultSchema;

export type InstructionPriorityVerdict = z.infer<typeof instructionPriorityVerdictSchema>;
export type InstructionPriorityInput = z.infer<typeof instructionPriorityInputSchema>;
export type InstructionPriorityResult = z.infer<typeof instructionPriorityResultSchema>;
