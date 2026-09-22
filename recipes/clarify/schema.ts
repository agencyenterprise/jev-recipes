import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const requirementVerdictSchema = z.enum(['present', 'missing', 'ambiguous']);
export const clarifyRequirementSchema = z.object({ id: nonEmptyText, description: nonEmptyText });
export const clarifyInputSchema = z.object({
  request: nonEmptyText,
  context: nonEmptyText.optional(),
  requirements: z
    .array(clarifyRequirementSchema)
    .min(1)
    .max(50)
    .refine(
      (requirements) =>
        new Set(requirements.map((requirement) => requirement.id)).size === requirements.length,
      'Requirement IDs must be unique.',
    ),
  minConfidence: probability.optional(),
});
export const clarifyResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  canProceed: z.boolean(),
  missing: z.array(nonEmptyText),
  ambiguous: z.array(nonEmptyText),
  checks: z.array(
    z.object({
      id: nonEmptyText,
      status: decisionStatusSchema,
      verdict: requirementVerdictSchema,
      confidence: probability,
      probabilities: z.record(requirementVerdictSchema, probability),
    }),
  ),
});
export type ClarifyInput = z.infer<typeof clarifyInputSchema>;
export type ClarifyRequirement = z.infer<typeof clarifyRequirementSchema>;
export type ClarifyResult = z.infer<typeof clarifyResultSchema>;
export type RequirementVerdict = z.infer<typeof requirementVerdictSchema>;
