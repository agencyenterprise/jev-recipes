import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const stepProgressVerdictSchema = z.enum(['progress', 'no_progress', 'setback', 'unclear']);
export const stepProgressInputSchema = z.object({
  objective: nonEmptyText,
  previousState: nonEmptyText,
  observation: nonEmptyText,
  minConfidence: probability.optional(),
});
export const stepProgressResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: stepProgressVerdictSchema,
  confidence: probability,
  probabilities: z.record(stepProgressVerdictSchema, probability),
});
export type StepProgressInput = z.infer<typeof stepProgressInputSchema>;
export type StepProgressResult = z.infer<typeof stepProgressResultSchema>;
export type StepProgressVerdict = z.infer<typeof stepProgressVerdictSchema>;
