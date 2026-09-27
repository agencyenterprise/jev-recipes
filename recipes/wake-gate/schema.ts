import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const wakeGateVerdictSchema = z.enum(['wake', 'not_yet', 'unrelated', 'unclear']);
export const wakeGateInputSchema = z.object({
  waitingFor: nonEmptyText,
  event: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const wakeGateResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: wakeGateVerdictSchema,
  confidence: probability,
  probabilities: z.record(wakeGateVerdictSchema, probability),
});

export type WakeGateVerdict = z.infer<typeof wakeGateVerdictSchema>;
export type WakeGateInput = z.infer<typeof wakeGateInputSchema>;
export type WakeGateResult = z.infer<typeof wakeGateResultSchema>;
