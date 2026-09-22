import { z } from 'zod';
import { nonEmptyText, probability, decisionResponseSchema } from '../../src/schema.js';
import { routeInputSchema, routeResultSchema } from '../../recipes/route/schema.js';
import { rerankResultSchema } from '../../recipes/rerank/schema.js';
import { verifyResultSchema } from '../../recipes/verify/schema.js';
import {
  answerabilityEvidenceSchema,
  answerabilityResultSchema,
} from '../../recipes/answerability/schema.js';
import { clarifyInputSchema, clarifyResultSchema } from '../../recipes/clarify/schema.js';
import { handoffInputSchema, handoffResultSchema } from '../../recipes/handoff/schema.js';

export const supportInputSchema = z.object({
  request: nonEmptyText,
  context: nonEmptyText.optional(),
  routes: routeInputSchema.shape.routes,
  requirements: clarifyInputSchema.shape.requirements,
  handoffRules: handoffInputSchema.shape.rules,
  evidence: z
    .array(answerabilityEvidenceSchema)
    .max(100)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      'Evidence IDs must be unique.',
    ),
  minConfidence: probability.optional(),
  minRelevance: probability.optional(),
  topK: z.number().int().min(1).max(50).optional(),
});
export const supportDraftContextSchema = z.object({
  request: nonEmptyText,
  context: nonEmptyText.optional(),
  route: nonEmptyText,
  evidence: z.array(answerabilityEvidenceSchema).min(1).max(50),
});
export const supportDraftSchema = z.object({
  claims: z
    .array(
      z.object({
        id: nonEmptyText,
        claim: nonEmptyText,
        evidenceIds: z
          .array(nonEmptyText)
          .min(1)
          .max(50)
          .refine((ids) => new Set(ids).size === ids.length, 'Evidence references must be unique.'),
      }),
    )
    .min(1)
    .max(100)
    .refine(
      (claims) => new Set(claims.map((claim) => claim.id)).size === claims.length,
      'Claim IDs must be unique.',
    ),
});
export const supportDecisionsSchema = z.object({
  handoff: handoffResultSchema.optional(),
  clarify: clarifyResultSchema.optional(),
  route: routeResultSchema.optional(),
  rerank: rerankResultSchema.optional(),
  answerability: answerabilityResultSchema.optional(),
  verify: verifyResultSchema.optional(),
});
export const supportResultSchema = z.discriminatedUnion('outcome', [
  z.object({
    outcome: z.literal('answered'),
    answer: nonEmptyText,
    draft: supportDraftSchema,
    decisions: supportDecisionsSchema,
  }),
  z.object({
    outcome: z.enum([
      'human',
      'review',
      'clarification',
      'no_evidence',
      'cannot_answer',
      'unverified',
    ]),
    stage: z.enum(['handoff', 'clarify', 'route', 'rerank', 'answerability', 'verify']),
    decisions: supportDecisionsSchema,
  }),
]);
export const supportFixtureSchema = z.object({
  input: supportInputSchema,
  draft: supportDraftSchema,
  responses: z.record(nonEmptyText, decisionResponseSchema),
});
export type SupportInput = z.infer<typeof supportInputSchema>;
export type SupportDraftContext = z.infer<typeof supportDraftContextSchema>;
export type SupportDraft = z.infer<typeof supportDraftSchema>;
export type SupportDecisions = z.infer<typeof supportDecisionsSchema>;
export type SupportResult = z.infer<typeof supportResultSchema>;
