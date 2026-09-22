import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const contextRoleVerdictSchema = z.enum([
  'direct_evidence',
  'background',
  'unrelated',
  'unclear',
]);
export const contextRoleInputSchema = z.object({
  question: nonEmptyText,
  passage: nonEmptyText,
  minConfidence: probability.optional(),
});
export const contextRoleResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: contextRoleVerdictSchema,
  confidence: probability,
  probabilities: z.record(contextRoleVerdictSchema, probability),
});
export type ContextRoleInput = z.infer<typeof contextRoleInputSchema>;
export type ContextRoleResult = z.infer<typeof contextRoleResultSchema>;
export type ContextRoleVerdict = z.infer<typeof contextRoleVerdictSchema>;
