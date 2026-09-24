import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const repetitionLevelVerdictSchema = z.enum([
  'varied',
  'some',
  'repetitive',
  'looping',
  'stuck',
]);
export const repetitionLevelInputSchema = z.object({
  recentMaterial: nonEmptyText,
  minConfidence: probability.optional(),
});
export const repetitionLevelResultSchema = scoreResultSchema.extend({
  repetition: repetitionLevelVerdictSchema,
});

export type RepetitionLevelVerdict = z.infer<typeof repetitionLevelVerdictSchema>;
export type RepetitionLevelInput = z.infer<typeof repetitionLevelInputSchema>;
export type RepetitionLevelResult = z.infer<typeof repetitionLevelResultSchema>;
