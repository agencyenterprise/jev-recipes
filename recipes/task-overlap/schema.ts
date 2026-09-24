import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const taskOverlapVerdictSchema = z.enum(['overlapping', 'disjoint']);

export const taskOverlapInputSchema = z.object({
  firstTask: nonEmptyText,
  secondTask: nonEmptyText,
  minConfidence: probability.optional(),
});

export const taskOverlapResultSchema = gateResultSchema.extend({
  verdict: taskOverlapVerdictSchema,
});

export type TaskOverlapVerdict = z.infer<typeof taskOverlapVerdictSchema>;
export type TaskOverlapInput = z.infer<typeof taskOverlapInputSchema>;
export type TaskOverlapResult = z.infer<typeof taskOverlapResultSchema>;
