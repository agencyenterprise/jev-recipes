import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const handoffCompletenessVerdictSchema = z.enum([
  'bare',
  'goal',
  'inputs',
  'defined',
  'complete',
]);

export const handoffCompletenessInputSchema = z.object({
  item: nonEmptyText,
  minConfidence: probability.optional(),
});

export const handoffCompletenessResultSchema = scoreResultSchema.extend({
  completeness: handoffCompletenessVerdictSchema,
});

export type HandoffCompletenessVerdict = z.infer<typeof handoffCompletenessVerdictSchema>;
export type HandoffCompletenessInput = z.infer<typeof handoffCompletenessInputSchema>;
export type HandoffCompletenessResult = z.infer<typeof handoffCompletenessResultSchema>;
