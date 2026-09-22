import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const claimVerdictSchema = z.enum(['supported', 'contradicted', 'unsupported']);

export const verifyClaimSchema = z.object({
  id: nonEmptyText,
  claim: nonEmptyText,
  evidence: nonEmptyText,
});

export const verifyInputSchema = z.object({
  claims: z
    .array(verifyClaimSchema)
    .min(1)
    .max(100)
    .refine(
      (claims) => new Set(claims.map((claim) => claim.id)).size === claims.length,
      'Claim IDs must be unique.',
    ),
  minConfidence: probability.optional(),
});

export const verifyResultSchema = resultMetadataSchema.extend({
  checks: z.array(
    z.object({
      id: nonEmptyText,
      status: decisionStatusSchema,
      verdict: claimVerdictSchema,
      confidence: probability,
      probabilities: z.record(claimVerdictSchema, probability),
    }),
  ),
  allSupported: z.boolean(),
});

export type ClaimVerdict = z.infer<typeof claimVerdictSchema>;
export type VerifyClaim = z.infer<typeof verifyClaimSchema>;
export type VerifyInput = z.infer<typeof verifyInputSchema>;
export type VerifyResult = z.infer<typeof verifyResultSchema>;
