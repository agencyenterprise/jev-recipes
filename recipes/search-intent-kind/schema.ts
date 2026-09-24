import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const searchIntentKindVerdictSchema = z.enum([
  'informational',
  'navigational',
  'transactional',
  'commercial',
  'local',
  'unclear',
]);
export const searchIntentKindInputSchema = z.object({
  query: nonEmptyText,
  minConfidence: probability.optional(),
});
export const searchIntentKindResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: searchIntentKindVerdictSchema,
  confidence: probability,
  probabilities: z.record(searchIntentKindVerdictSchema, probability),
});

export type SearchIntentKindVerdict = z.infer<typeof searchIntentKindVerdictSchema>;
export type SearchIntentKindInput = z.infer<typeof searchIntentKindInputSchema>;
export type SearchIntentKindResult = z.infer<typeof searchIntentKindResultSchema>;
