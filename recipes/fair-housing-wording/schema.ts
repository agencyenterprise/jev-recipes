import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const fairHousingWordingVerdictSchema = z.enum(['flagged', 'clean']);
export const fairHousingWordingInputSchema = z.object({
  listing: nonEmptyText,
  minConfidence: probability.optional(),
});
export const fairHousingWordingResultSchema = gateResultSchema.extend({
  verdict: fairHousingWordingVerdictSchema,
});

export type FairHousingWordingVerdict = z.infer<typeof fairHousingWordingVerdictSchema>;
export type FairHousingWordingInput = z.infer<typeof fairHousingWordingInputSchema>;
export type FairHousingWordingResult = z.infer<typeof fairHousingWordingResultSchema>;
