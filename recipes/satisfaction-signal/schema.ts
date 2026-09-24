import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const satisfactionSignalVerdictSchema = z.enum([
  'dissatisfied',
  'low',
  'neutral',
  'satisfied',
  'delighted',
]);

export const satisfactionSignalInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});

export const satisfactionSignalResultSchema = scoreResultSchema.extend({
  satisfaction: satisfactionSignalVerdictSchema,
});

export type SatisfactionSignalVerdict = z.infer<typeof satisfactionSignalVerdictSchema>;
export type SatisfactionSignalInput = z.infer<typeof satisfactionSignalInputSchema>;
export type SatisfactionSignalResult = z.infer<typeof satisfactionSignalResultSchema>;
