import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const taskDependencyVerdictSchema = z.enum([
  'first_before_second',
  'second_before_first',
  'independent',
  'cyclic',
  'unclear',
]);
export const taskDependencyInputSchema = z.object({
  firstTask: nonEmptyText.describe('The first task, including its inputs and output when known.'),
  secondTask: nonEmptyText.describe('The second task, including its inputs and output when known.'),
  context: nonEmptyText
    .describe('Known prerequisites, available inputs, and relevant workflow conditions.')
    .optional(),
  minConfidence: probability.optional(),
});
export const taskDependencyResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: taskDependencyVerdictSchema,
  confidence: probability,
  probabilities: z.record(taskDependencyVerdictSchema, probability),
});
export type TaskDependencyInput = z.infer<typeof taskDependencyInputSchema>;
export type TaskDependencyResult = z.infer<typeof taskDependencyResultSchema>;
export type TaskDependencyVerdict = z.infer<typeof taskDependencyVerdictSchema>;
