import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const constraintStrengthVerdictSchema = z.enum([
  'required',
  'preferred',
  'optional',
  'unclear',
]);
export const constraintStrengthInputSchema = z.object({
  statement: nonEmptyText.describe('One constraint or preference to interpret.'),
  context: nonEmptyText
    .describe('The surrounding request and any qualifications that clarify its force.')
    .optional(),
  minConfidence: probability.optional(),
});
export const constraintStrengthResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: constraintStrengthVerdictSchema,
  confidence: probability,
  probabilities: z.record(constraintStrengthVerdictSchema, probability),
});
export type ConstraintStrengthInput = z.infer<typeof constraintStrengthInputSchema>;
export type ConstraintStrengthResult = z.infer<typeof constraintStrengthResultSchema>;
export type ConstraintStrengthVerdict = z.infer<typeof constraintStrengthVerdictSchema>;
