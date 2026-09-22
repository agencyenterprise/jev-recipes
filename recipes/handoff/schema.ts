import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const handoffVerdictSchema = z.enum(['matches', 'does_not_match', 'unclear']);
export const handoffRuleSchema = z.object({ id: nonEmptyText, description: nonEmptyText });
export const handoffInputSchema = z.object({
  request: nonEmptyText,
  context: nonEmptyText.optional(),
  rules: z
    .array(handoffRuleSchema)
    .min(1)
    .max(50)
    .refine(
      (rules) => new Set(rules.map((rule) => rule.id)).size === rules.length,
      'Rule IDs must be unique.',
    ),
  minConfidence: probability.optional(),
});
export const handoffResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  decision: z.enum(['human', 'continue', 'review']),
  matchedRules: z.array(nonEmptyText),
  uncertainRules: z.array(nonEmptyText),
  checks: z.array(
    z.object({
      id: nonEmptyText,
      status: decisionStatusSchema,
      verdict: handoffVerdictSchema,
      confidence: probability,
      probabilities: z.record(handoffVerdictSchema, probability),
    }),
  ),
});
export type HandoffInput = z.infer<typeof handoffInputSchema>;
export type HandoffRule = z.infer<typeof handoffRuleSchema>;
export type HandoffResult = z.infer<typeof handoffResultSchema>;
export type HandoffVerdict = z.infer<typeof handoffVerdictSchema>;
