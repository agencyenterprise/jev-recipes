import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const audienceFitVerdictSchema = z.enum([
  'appropriate',
  'too_technical',
  'too_basic',
  'unclear',
]);
export const audienceFitInputSchema = z.object({
  document: nonEmptyText,
  audience: nonEmptyText,
  minConfidence: probability.optional(),
});
export const audienceFitResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: audienceFitVerdictSchema,
  confidence: probability,
  probabilities: z.record(audienceFitVerdictSchema, probability),
});
export type AudienceFitInput = z.infer<typeof audienceFitInputSchema>;
export type AudienceFitResult = z.infer<typeof audienceFitResultSchema>;
export type AudienceFitVerdict = z.infer<typeof audienceFitVerdictSchema>;
