import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const requirementTestabilityVerdictSchema = z.enum(['testable', 'not_testable', 'unclear']);
export const requirementTestabilityInputSchema = z.object({
  requirement: nonEmptyText.describe('One requirement whose completion criteria need review.'),
  context: nonEmptyText
    .describe('Supplied definitions, acceptance criteria, and observation conditions.')
    .optional(),
  minConfidence: probability.optional(),
});
export const requirementTestabilityResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: requirementTestabilityVerdictSchema,
  confidence: probability,
  probabilities: z.record(requirementTestabilityVerdictSchema, probability),
});
export type RequirementTestabilityInput = z.infer<typeof requirementTestabilityInputSchema>;
export type RequirementTestabilityResult = z.infer<typeof requirementTestabilityResultSchema>;
export type RequirementTestabilityVerdict = z.infer<typeof requirementTestabilityVerdictSchema>;
