import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const passageDuplicateVerdictSchema = z.enum([
  'duplicate',
  'overlapping',
  'distinct',
  'unclear',
]);
export const passageDuplicateInputSchema = z.object({
  firstPassage: nonEmptyText,
  secondPassage: nonEmptyText,
  minConfidence: probability.optional(),
});
export const passageDuplicateResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: passageDuplicateVerdictSchema,
  confidence: probability,
  probabilities: z.record(passageDuplicateVerdictSchema, probability),
});
export type PassageDuplicateInput = z.infer<typeof passageDuplicateInputSchema>;
export type PassageDuplicateResult = z.infer<typeof passageDuplicateResultSchema>;
export type PassageDuplicateVerdict = z.infer<typeof passageDuplicateVerdictSchema>;
