import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const actionScopeVerdictSchema = z.enum(['within_scope', 'additional_work', 'unclear']);
export const actionScopeInputSchema = z.object({
  request: nonEmptyText,
  proposedAction: nonEmptyText,
  constraints: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const actionScopeResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: actionScopeVerdictSchema,
  confidence: probability,
  probabilities: z.record(actionScopeVerdictSchema, probability),
});
export type ActionScopeInput = z.infer<typeof actionScopeInputSchema>;
export type ActionScopeResult = z.infer<typeof actionScopeResultSchema>;
export type ActionScopeVerdict = z.infer<typeof actionScopeVerdictSchema>;
