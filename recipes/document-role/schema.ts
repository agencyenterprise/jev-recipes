import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const documentRoleVerdictSchema = z.enum([
  'policy',
  'tutorial',
  'reference',
  'troubleshooting',
  'release_note',
  'other',
  'unclear',
]);
export const documentRoleInputSchema = z.object({
  document: nonEmptyText,
  minConfidence: probability.optional(),
});
export const documentRoleResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: documentRoleVerdictSchema,
  confidence: probability,
  probabilities: z.record(documentRoleVerdictSchema, probability),
});
export type DocumentRoleInput = z.infer<typeof documentRoleInputSchema>;
export type DocumentRoleResult = z.infer<typeof documentRoleResultSchema>;
export type DocumentRoleVerdict = z.infer<typeof documentRoleVerdictSchema>;
