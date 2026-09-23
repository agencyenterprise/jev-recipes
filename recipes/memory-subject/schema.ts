import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';

export const memorySubjectVerdictSchema = z.enum(['user', 'other', 'shared', 'unclear']);
export const memorySubjectInputSchema = z.object({
  statement: nonEmptyText.describe(
    'One atomic statement or candidate memory whose subject should be identified.',
  ),
  user: nonEmptyText.describe(
    'The person whose memory profile is being considered, including their speaker role when relevant.',
  ),
  context: nonEmptyText
    .describe('Supplied speaker identities or surrounding text needed to resolve references.')
    .optional(),
  minConfidence: probability.optional(),
});
export const memorySubjectResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: memorySubjectVerdictSchema,
  confidence: probability,
  probabilities: z.record(memorySubjectVerdictSchema, probability),
});
export type MemorySubjectInput = z.infer<typeof memorySubjectInputSchema>;
export type MemorySubjectResult = z.infer<typeof memorySubjectResultSchema>;
export type MemorySubjectVerdict = z.infer<typeof memorySubjectVerdictSchema>;
