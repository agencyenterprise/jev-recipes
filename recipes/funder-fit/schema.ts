import { z } from 'zod';
import {
  comparisonResultSchema,
  comparisonVerdictSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const funderFitVerdictSchema = comparisonVerdictSchema;
export const funderFitInputSchema = z.object({
  program: nonEmptyText,
  firstOpportunity: nonEmptyText,
  secondOpportunity: nonEmptyText,
  minConfidence: probability.optional(),
});
export const funderFitResultSchema = comparisonResultSchema;

export type FunderFitVerdict = z.infer<typeof funderFitVerdictSchema>;
export type FunderFitInput = z.infer<typeof funderFitInputSchema>;
export type FunderFitResult = z.infer<typeof funderFitResultSchema>;
