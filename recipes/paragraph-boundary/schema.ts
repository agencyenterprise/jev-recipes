import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const paragraphBoundaryVerdictSchema = z.enum(['continue', 'separate', 'unclear']);
export const paragraphBoundaryInputSchema = z.object({
  left: nonEmptyText,
  right: nonEmptyText,
  before: nonEmptyText.optional(),
  after: nonEmptyText.optional(),
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const paragraphBoundaryResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: paragraphBoundaryVerdictSchema,
  confidence: probability,
  probabilities: z.record(paragraphBoundaryVerdictSchema, probability),
});

export type ParagraphBoundaryVerdict = z.infer<typeof paragraphBoundaryVerdictSchema>;
export type ParagraphBoundaryInput = z.infer<typeof paragraphBoundaryInputSchema>;
export type ParagraphBoundaryResult = z.infer<typeof paragraphBoundaryResultSchema>;
