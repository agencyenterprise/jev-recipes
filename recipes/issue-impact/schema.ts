import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const issueImpactVerdictSchema = z.enum(['blocked', 'degraded', 'cosmetic', 'unclear']);
export const issueImpactInputSchema = z.object({
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const issueImpactResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: issueImpactVerdictSchema,
  confidence: probability,
  probabilities: z.record(issueImpactVerdictSchema, probability),
});
export type IssueImpactInput = z.infer<typeof issueImpactInputSchema>;
export type IssueImpactResult = z.infer<typeof issueImpactResultSchema>;
export type IssueImpactVerdict = z.infer<typeof issueImpactVerdictSchema>;
