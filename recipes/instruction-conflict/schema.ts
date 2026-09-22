import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const instructionConflictVerdictSchema = z.enum([
  'compatible',
  'conflicting',
  'different_scope',
  'unclear',
]);
export const instructionConflictInputSchema = z.object({
  firstInstruction: nonEmptyText.describe('The first instruction to compare.'),
  secondInstruction: nonEmptyText.describe('The second instruction to compare.'),
  context: nonEmptyText
    .describe('The task and circumstances in which the instructions may apply.')
    .optional(),
  minConfidence: probability.optional(),
});
export const instructionConflictResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: instructionConflictVerdictSchema,
  confidence: probability,
  probabilities: z.record(instructionConflictVerdictSchema, probability),
});
export type InstructionConflictInput = z.infer<typeof instructionConflictInputSchema>;
export type InstructionConflictResult = z.infer<typeof instructionConflictResultSchema>;
export type InstructionConflictVerdict = z.infer<typeof instructionConflictVerdictSchema>;
