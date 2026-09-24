import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const dawRequestKindVerdictSchema = z.enum([
  'record',
  'edit',
  'mix',
  'effect',
  'arrange',
  'export',
  'unclear',
]);
export const dawRequestKindInputSchema = z.object({
  request: nonEmptyText,
  minConfidence: probability.optional(),
});
export const dawRequestKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: dawRequestKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(dawRequestKindVerdictSchema, probability),
});

export type DawRequestKindVerdict = z.infer<typeof dawRequestKindVerdictSchema>;
export type DawRequestKindInput = z.infer<typeof dawRequestKindInputSchema>;
export type DawRequestKindResult = z.infer<typeof dawRequestKindResultSchema>;
