import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const politenessLevelVerdictSchema = z.enum([
  'hostile',
  'curt',
  'neutral',
  'courteous',
  'deferential',
]);

export const politenessLevelInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const politenessLevelResultSchema = scoreResultSchema.extend({
  politeness: politenessLevelVerdictSchema,
});

export type PolitenessLevelVerdict = z.infer<typeof politenessLevelVerdictSchema>;
export type PolitenessLevelInput = z.infer<typeof politenessLevelInputSchema>;
export type PolitenessLevelResult = z.infer<typeof politenessLevelResultSchema>;
