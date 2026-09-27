import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
  textItemsSchema,
} from '../../src/schema.js';

export const contextPruneVerdictSchema = z.enum(['keep', 'drop']);
export const contextPruneInputSchema = z.object({
  objective: nonEmptyText,
  items: textItemsSchema,
  recent: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const contextPruneItemSchema = z.object({
  id: nonEmptyText,
  status: decisionStatusSchema,
  verdict: contextPruneVerdictSchema,
  probability,
  confidence: probability,
});
export const contextPruneResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  items: z.array(contextPruneItemSchema),
  keep: z.array(nonEmptyText),
  drop: z.array(nonEmptyText),
  evaluated: z.number().int().nonnegative(),
});
export type ContextPruneVerdict = z.infer<typeof contextPruneVerdictSchema>;
export type ContextPruneInput = z.infer<typeof contextPruneInputSchema>;
export type ContextPruneItem = z.infer<typeof contextPruneItemSchema>;
export type ContextPruneResult = z.infer<typeof contextPruneResultSchema>;
