import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const instrumentIssueKindVerdictSchema = z.enum([
  'tuning',
  'buzz_or_rattle',
  'no_sound',
  'intonation',
  'mechanical',
  'cosmetic',
  'unclear',
]);
export const instrumentIssueKindInputSchema = z.object({
  report: nonEmptyText,
  minConfidence: probability.optional(),
});
export const instrumentIssueKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: instrumentIssueKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(instrumentIssueKindVerdictSchema, probability),
});

export type InstrumentIssueKindVerdict = z.infer<typeof instrumentIssueKindVerdictSchema>;
export type InstrumentIssueKindInput = z.infer<typeof instrumentIssueKindInputSchema>;
export type InstrumentIssueKindResult = z.infer<typeof instrumentIssueKindResultSchema>;
