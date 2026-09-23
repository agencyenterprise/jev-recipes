import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';

export const issueRecurrenceVerdictSchema = z.enum(['new', 'ongoing', 'returned', 'unclear']);
export const issueRecurrenceInputSchema = z.object({
  issue: nonEmptyText.describe(
    'One specific problem whose reported recurrence should be assessed.',
  ),
  message: nonEmptyText.describe('The latest customer report about the issue.'),
  history: nonEmptyText
    .describe(
      'Earlier reports in chronological order, oldest first, with speaker identities and reported outcomes.',
    )
    .optional(),
  minConfidence: probability.optional(),
});
export const issueRecurrenceResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: issueRecurrenceVerdictSchema,
  confidence: probability,
  probabilities: z.record(issueRecurrenceVerdictSchema, probability),
});
export type IssueRecurrenceInput = z.infer<typeof issueRecurrenceInputSchema>;
export type IssueRecurrenceResult = z.infer<typeof issueRecurrenceResultSchema>;
export type IssueRecurrenceVerdict = z.infer<typeof issueRecurrenceVerdictSchema>;
