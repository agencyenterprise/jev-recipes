import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const cancellationCheckVerdictSchema = z.enum(['cancel', 'pause', 'continue', 'unclear']);
export const cancellationCheckInputSchema = z.object({
  task: nonEmptyText,
  message: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const cancellationCheckResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: cancellationCheckVerdictSchema,
  confidence: probability,
  probabilities: z.record(cancellationCheckVerdictSchema, probability),
});
export type CancellationCheckInput = z.infer<typeof cancellationCheckInputSchema>;
export type CancellationCheckResult = z.infer<typeof cancellationCheckResultSchema>;
export type CancellationCheckVerdict = z.infer<typeof cancellationCheckVerdictSchema>;
