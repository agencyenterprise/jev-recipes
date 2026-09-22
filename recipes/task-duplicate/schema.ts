import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const taskDuplicateVerdictSchema = z.enum([
  'duplicate',
  'overlapping',
  'distinct',
  'unclear',
]);
export const taskDuplicateInputSchema = z.object({
  firstTask: nonEmptyText.describe('The first task and its intended outcome.'),
  secondTask: nonEmptyText.describe('The second task and its intended outcome.'),
  context: nonEmptyText
    .describe('Relevant targets, scope, time periods, and constraints for the comparison.')
    .optional(),
  minConfidence: probability.optional(),
});
export const taskDuplicateResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: taskDuplicateVerdictSchema,
  confidence: probability,
  probabilities: z.record(taskDuplicateVerdictSchema, probability),
});
export type TaskDuplicateInput = z.infer<typeof taskDuplicateInputSchema>;
export type TaskDuplicateResult = z.infer<typeof taskDuplicateResultSchema>;
export type TaskDuplicateVerdict = z.infer<typeof taskDuplicateVerdictSchema>;
