import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const textBlockRoleVerdictSchema = z.enum([
  'heading',
  'body',
  'list_item',
  'code',
  'table',
  'caption',
  'formula',
  'other',
  'unclear',
]);
export const textBlockRoleInputSchema = z.object({
  text: nonEmptyText,
  before: nonEmptyText.optional(),
  after: nonEmptyText.optional(),
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const textBlockRoleResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: textBlockRoleVerdictSchema,
  confidence: probability,
  probabilities: z.record(textBlockRoleVerdictSchema, probability),
});

export type TextBlockRoleVerdict = z.infer<typeof textBlockRoleVerdictSchema>;
export type TextBlockRoleInput = z.infer<typeof textBlockRoleInputSchema>;
export type TextBlockRoleResult = z.infer<typeof textBlockRoleResultSchema>;
