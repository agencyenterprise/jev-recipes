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

export const recipeCategorySchema = z.enum(['retrieval', 'conversation', 'workflow']);
export const recipeMetadataSchema = z.object({
  id: nonEmptyText,
  title: nonEmptyText,
  description: nonEmptyText,
  category: recipeCategorySchema,
  tags: z.array(nonEmptyText),
  limitations: z.array(nonEmptyText),
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
