import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const piiPresenceVerdictSchema = z.enum(['present', 'absent']);

export const piiPresenceInputSchema = z.object({
  text: nonEmptyText,
  minConfidence: probability.optional(),
});

export const piiPresenceResultSchema = gateResultSchema.extend({
  verdict: piiPresenceVerdictSchema,
});

export type PiiPresenceVerdict = z.infer<typeof piiPresenceVerdictSchema>;
export type PiiPresenceInput = z.infer<typeof piiPresenceInputSchema>;
export type PiiPresenceResult = z.infer<typeof piiPresenceResultSchema>;
