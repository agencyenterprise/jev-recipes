import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const sentimentShiftVerdictSchema = z.enum(['improved', 'unchanged', 'worsened', 'unclear']);
export const sentimentShiftInputSchema = z.object({
  earlierMessage: nonEmptyText,
  laterMessage: nonEmptyText,
  minConfidence: probability.optional(),
});
export const sentimentShiftResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: sentimentShiftVerdictSchema,
  confidence: probability,
  probabilities: z.record(sentimentShiftVerdictSchema, probability),
});
export type SentimentShiftInput = z.infer<typeof sentimentShiftInputSchema>;
export type SentimentShiftResult = z.infer<typeof sentimentShiftResultSchema>;
export type SentimentShiftVerdict = z.infer<typeof sentimentShiftVerdictSchema>;
