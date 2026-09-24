import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const instructionClarityVerdictSchema = z.enum([
  'unusable',
  'ambiguous',
  'gappy',
  'clear',
  'precise',
]);

export const instructionClarityInputSchema = z.object({
  instruction: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const instructionClarityResultSchema = scoreResultSchema.extend({
  clarity: instructionClarityVerdictSchema,
});

export type InstructionClarityVerdict = z.infer<typeof instructionClarityVerdictSchema>;
export type InstructionClarityInput = z.infer<typeof instructionClarityInputSchema>;
export type InstructionClarityResult = z.infer<typeof instructionClarityResultSchema>;
