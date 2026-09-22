import { z } from 'zod';
import {
  decisionStatusSchema,
  nonEmptyText,
  probability,
  resultMetadataSchema,
} from '../../src/schema.js';

export const rerankItemSchema = z.object({
  id: nonEmptyText,
  text: nonEmptyText,
});

export const rerankInputSchema = z.object({
  query: nonEmptyText,
  items: z
    .array(rerankItemSchema)
    .min(1)
    .max(100)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      'Item IDs must be unique.',
    ),
  topK: z.number().int().min(1).max(100).optional(),
  minRelevance: probability.optional(),
});

export const rerankResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  items: z.array(rerankItemSchema.extend({ relevance: probability })),
  evaluated: z.number().int().nonnegative(),
});

export type RerankItem = z.infer<typeof rerankItemSchema>;
export type RerankInput = z.infer<typeof rerankInputSchema>;
export type RerankResult = z.infer<typeof rerankResultSchema>;
