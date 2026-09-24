import { z } from 'zod';
import {
  assignmentsResultSchema,
  nonEmptyText,
  optionSlotsSchema,
  probability,
} from '../../src/schema.js';

export const fingerActionsInputSchema = z.object({
  music: nonEmptyText,
  beat: nonEmptyText,
  fingers: optionSlotsSchema,
  style: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const fingerActionsResultSchema = assignmentsResultSchema;
export type FingerActionsInput = z.infer<typeof fingerActionsInputSchema>;
export type FingerActionsResult = z.infer<typeof fingerActionsResultSchema>;
