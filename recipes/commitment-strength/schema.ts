import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const commitmentStrengthVerdictSchema = z.enum([
  'none',
  'vague',
  'conditional',
  'firm',
  'binding',
]);

export const commitmentStrengthInputSchema = z.object({
  statement: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const commitmentStrengthResultSchema = scoreResultSchema.extend({
  commitment: commitmentStrengthVerdictSchema,
});

export type CommitmentStrengthVerdict = z.infer<typeof commitmentStrengthVerdictSchema>;
export type CommitmentStrengthInput = z.infer<typeof commitmentStrengthInputSchema>;
export type CommitmentStrengthResult = z.infer<typeof commitmentStrengthResultSchema>;
