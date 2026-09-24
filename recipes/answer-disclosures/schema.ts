import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const answerDisclosuresLabelSchema = z.enum([
  'statesUncertainty',
  'statesLimitations',
  'citesSources',
  'statesAssumptions',
]);
export const answerDisclosuresInputSchema = z.object({
  draft: nonEmptyText,
  minConfidence: probability.optional(),
});
export const answerDisclosuresResultSchema = labelsResultSchema.extend({
  detected: z.array(answerDisclosuresLabelSchema),
  labels: z.object({
    statesUncertainty: labelCheckSchema,
    statesLimitations: labelCheckSchema,
    citesSources: labelCheckSchema,
    statesAssumptions: labelCheckSchema,
  }),
});
export type AnswerDisclosuresLabel = z.infer<typeof answerDisclosuresLabelSchema>;
export type AnswerDisclosuresInput = z.infer<typeof answerDisclosuresInputSchema>;
export type AnswerDisclosuresResult = z.infer<typeof answerDisclosuresResultSchema>;
