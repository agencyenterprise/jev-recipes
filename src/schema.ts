import { z } from 'zod';
import type { TypeSafeClient } from '@typesafe-ai/sdk';

export const nonEmptyText = z
  .string()
  .refine((value) => value.trim().length > 0, 'Must contain non-empty text.');
export const probability = z.number().min(0).max(1);
export const decisionStatusSchema = z.enum(['ready', 'review']);

export const resultMetadataSchema = z.object({
  model: nonEmptyText,
  usage: z.object({
    input_tokens: z.number().int().nonnegative(),
    output_tokens: z.number().int().nonnegative(),
  }),
});

export const decisionStateSchema = z.record(z.string(), z.json());

export const decisionResponseSchema = resultMetadataSchema.extend({
  answers: z.record(z.string(), z.unknown()),
});

export const decisionClientSchema = z.custom<{
  systemOne(...args: Parameters<TypeSafeClient['systemOne']>): PromiseLike<unknown>;
}>(hasDecisionMethod, 'Client must provide a systemOne method.');

export const recipeOptionsSchema = z.object({
  client: decisionClientSchema.optional(),
  model: nonEmptyText.optional(),
  signal: z.instanceof(AbortSignal).optional(),
});

export const identifiedItemSchema = z.object({ id: nonEmptyText });
export const textItemSchema = identifiedItemSchema.extend({ text: nonEmptyText });
export const textItemsSchema = z
  .array(textItemSchema)
  .min(1)
  .max(50)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    'Item IDs must be unique.',
  );
export const selectionResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: z.enum(['matched', 'none', 'ambiguous']),
  selection: nonEmptyText.nullable(),
  suggestedSelection: nonEmptyText.nullable(),
  confidence: probability,
  probabilities: z.object({
    candidates: z.record(nonEmptyText, probability),
    none: probability,
    ambiguous: probability,
  }),
});
export type IdentifiedItem = z.infer<typeof identifiedItemSchema>;
export type TextItem = z.infer<typeof textItemSchema>;
export type SelectionResult = z.infer<typeof selectionResultSchema>;

export const recipeCategorySchema = z.enum([
  'retrieval',
  'conversation',
  'workflow',
  'answer-quality',
  'support',
  'memory',
  'knowledge',
]);
export const recipeMetadataSchema = z.object({
  id: nonEmptyText,
  title: nonEmptyText,
  description: nonEmptyText,
  category: recipeCategorySchema,
  tags: z.array(nonEmptyText),
  limitations: z.array(nonEmptyText),
  uses: z.array(nonEmptyText).optional(),
  useWhen: nonEmptyText.optional(),
  related: z.array(z.object({ id: nonEmptyText, reason: nonEmptyText })).optional(),
});
export type RecipeMetadata = z.infer<typeof recipeMetadataSchema>;
export type RecipeCategory = z.infer<typeof recipeCategorySchema>;

export type DecisionClient = z.infer<typeof decisionClientSchema>;
export type DecisionStatus = z.infer<typeof decisionStatusSchema>;
export type RecipeOptions = z.infer<typeof recipeOptionsSchema>;
export type ResultMetadata = z.infer<typeof resultMetadataSchema>;

function hasDecisionMethod(client: unknown): boolean {
  return (
    typeof client === 'object' &&
    client !== null &&
    'systemOne' in client &&
    typeof client.systemOne === 'function'
  );
}
