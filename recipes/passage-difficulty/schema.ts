import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const passageDifficultyVerdictSchema = z.enum([
  'beginner',
  'easy',
  'intermediate',
  'advanced',
  'virtuoso',
]);
export const passageDifficultyInputSchema = z.object({
  passage: nonEmptyText,
  instrument: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const passageDifficultyResultSchema = scoreResultSchema.extend({
  difficulty: passageDifficultyVerdictSchema,
});

export type PassageDifficultyVerdict = z.infer<typeof passageDifficultyVerdictSchema>;
export type PassageDifficultyInput = z.infer<typeof passageDifficultyInputSchema>;
export type PassageDifficultyResult = z.infer<typeof passageDifficultyResultSchema>;
