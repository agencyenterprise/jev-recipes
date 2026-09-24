import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const logLineKindVerdictSchema = z.enum([
  'error',
  'warning',
  'lifecycle',
  'request',
  'metric',
  'debug',
  'unclear',
]);
export const logLineKindInputSchema = z.object({
  line: nonEmptyText,
  minConfidence: probability.optional(),
});
export const logLineKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: logLineKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(logLineKindVerdictSchema, probability),
});

export type LogLineKindVerdict = z.infer<typeof logLineKindVerdictSchema>;
export type LogLineKindInput = z.infer<typeof logLineKindInputSchema>;
export type LogLineKindResult = z.infer<typeof logLineKindResultSchema>;
