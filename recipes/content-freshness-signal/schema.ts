import { z } from 'zod';
import { gateResultSchema, nonEmptyText, probability } from '../../src/schema.js';

export const contentFreshnessSignalVerdictSchema = z.enum(['perishable', 'evergreen']);
export const contentFreshnessSignalInputSchema = z.object({
  content: nonEmptyText,
  minConfidence: probability.optional(),
});
export const contentFreshnessSignalResultSchema = gateResultSchema.extend({
  verdict: contentFreshnessSignalVerdictSchema,
});

export type ContentFreshnessSignalVerdict = z.infer<typeof contentFreshnessSignalVerdictSchema>;
export type ContentFreshnessSignalInput = z.infer<typeof contentFreshnessSignalInputSchema>;
export type ContentFreshnessSignalResult = z.infer<typeof contentFreshnessSignalResultSchema>;
