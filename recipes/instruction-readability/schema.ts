import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const instructionReadabilityVerdictSchema = z.enum([
  'dense',
  'heavy',
  'mixed',
  'plain',
  'clear',
]);
export const instructionReadabilityInputSchema = z.object({
  instructions: nonEmptyText,
  audience: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const instructionReadabilityResultSchema = scoreResultSchema.extend({
  readability: instructionReadabilityVerdictSchema,
});

export type InstructionReadabilityVerdict = z.infer<typeof instructionReadabilityVerdictSchema>;
export type InstructionReadabilityInput = z.infer<typeof instructionReadabilityInputSchema>;
export type InstructionReadabilityResult = z.infer<typeof instructionReadabilityResultSchema>;
