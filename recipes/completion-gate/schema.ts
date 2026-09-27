import { z } from 'zod';
import {
  decisionStatusSchema,
  labelCheckSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const completionGateVerdictSchema = z.enum([
  'complete',
  'incomplete',
  'unverified',
  'unclear',
]);
export const completionGateSignalSchema = z.enum([
  'claimsWithoutEvidence',
  'scopeNarrowed',
  'openQuestions',
  'unresolvedErrors',
]);
export const completionGateInputSchema = z.object({
  task: nonEmptyText,
  report: nonEmptyText,
  evidence: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const completionGateResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: completionGateVerdictSchema,
  confidence: probability,
  probabilities: z.record(completionGateVerdictSchema, probability),
  signals: z.object({
    claimsWithoutEvidence: labelCheckSchema,
    scopeNarrowed: labelCheckSchema,
    openQuestions: labelCheckSchema,
    unresolvedErrors: labelCheckSchema,
  }),
  detected: z.array(completionGateSignalSchema),
});
export type CompletionGateVerdict = z.infer<typeof completionGateVerdictSchema>;
export type CompletionGateSignal = z.infer<typeof completionGateSignalSchema>;
export type CompletionGateInput = z.infer<typeof completionGateInputSchema>;
export type CompletionGateResult = z.infer<typeof completionGateResultSchema>;
