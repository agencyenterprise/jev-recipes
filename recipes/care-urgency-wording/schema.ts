import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const careUrgencyWordingVerdictSchema = z.enum([
  'routine',
  'soon',
  'prompt',
  'urgent',
  'emergency',
]);
export const careUrgencyWordingInputSchema = z.object({
  message: nonEmptyText,
  minConfidence: probability.optional(),
});
export const careUrgencyWordingResultSchema = scoreResultSchema.extend({
  urgency: careUrgencyWordingVerdictSchema,
});

export type CareUrgencyWordingVerdict = z.infer<typeof careUrgencyWordingVerdictSchema>;
export type CareUrgencyWordingInput = z.infer<typeof careUrgencyWordingInputSchema>;
export type CareUrgencyWordingResult = z.infer<typeof careUrgencyWordingResultSchema>;
