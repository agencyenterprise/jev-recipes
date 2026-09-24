import { z } from 'zod';
import { nonEmptyText, probability, scoreResultSchema } from '../../src/schema.js';

export const bugReportCompletenessVerdictSchema = z.enum([
  'bare',
  'symptom',
  'partial',
  'nearly',
  'complete',
]);

export const bugReportCompletenessInputSchema = z.object({
  report: nonEmptyText,
  minConfidence: probability.optional(),
});

export const bugReportCompletenessResultSchema = scoreResultSchema.extend({
  completeness: bugReportCompletenessVerdictSchema,
});

export type BugReportCompletenessVerdict = z.infer<typeof bugReportCompletenessVerdictSchema>;
export type BugReportCompletenessInput = z.infer<typeof bugReportCompletenessInputSchema>;
export type BugReportCompletenessResult = z.infer<typeof bugReportCompletenessResultSchema>;
