import { z } from 'zod';
import { nonEmptyText, probability } from '../src/schema.js';
import { recordWithOwnKeys, jsonValueSchema } from '../src/data.js';

export const provenanceSchema = z.object({
  method: z.enum(['author-synthetic', 'human-reviewed', 'public-dataset', 'unspecified']),
  source: nonEmptyText,
});

export const evaluationCaseSchema = z.object({
  id: nonEmptyText,
  input: recordWithOwnKeys(z.string(), jsonValueSchema),
  expected: recordWithOwnKeys(nonEmptyText, jsonValueSchema).refine(
    (expected) => Object.keys(expected).length > 0,
    'Provide at least one expected result field.',
  ),
  rationale: nonEmptyText,
  family: nonEmptyText.optional(),
  split: z.enum(['development', 'held-out']).default('development'),
  provenance: provenanceSchema.default({
    method: 'unspecified',
    source: 'Not recorded by the dataset author.',
  }),
  contested: z.boolean().default(false),
  adversarial: z.boolean().default(false),
});

export const evaluationPolicySchema = z.object({
  minConfidence: probability.optional(),
  selectedOn: z
    .object({
      runId: nonEmptyText,
      datasetFingerprint: nonEmptyText,
      recipeFingerprint: nonEmptyText,
      model: nonEmptyText,
      split: z.literal('development'),
    })
    .optional(),
});

export const priceSchema = z.object({
  model: nonEmptyText,
  inputPerMillion: z.number().nonnegative(),
  outputPerMillion: z.number().nonnegative(),
  currency: z.literal('USD'),
  date: z.iso.date(),
  source: nonEmptyText,
});

export const evaluationOptionsSchema = z.object({
  concurrency: z.number().int().min(1).max(32).default(4),
  maxCases: z.number().int().positive().default(1000),
  maxRequests: z.number().int().positive().default(1000),
  model: nonEmptyText.optional(),
  split: z.enum(['development', 'held-out']).default('development'),
  policy: evaluationPolicySchema.default({}),
  price: priceSchema.optional(),
});

export type EvaluationCase = z.infer<typeof evaluationCaseSchema>;
export type EvaluationPolicy = z.infer<typeof evaluationPolicySchema>;
export type EvaluationOptions = z.input<typeof evaluationOptionsSchema>;
export type Price = z.infer<typeof priceSchema>;
