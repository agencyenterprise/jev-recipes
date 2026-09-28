import { z } from 'zod';
import { supportRequestSchema, proposalSchema } from '../../examples/support-routing/schema.mjs';

export const workflowCaseSchema = z
  .object({
    id: z.string().min(1),
    family: z.string().min(1),
    group: z.string().min(1),
    split: z.enum(['development', 'held-out']),
    input: supportRequestSchema,
    expectedRoute: z.string().min(1).nullable(),
    rationale: z.string().min(1),
    provenance: z.object({ method: z.literal('author-synthetic'), source: z.string().min(1) }),
  })
  .strict();

export const policySchema = z
  .object({
    version: z.literal(1),
    minConfidence: z.number().min(0).max(1),
    primaryModel: z.string().min(1),
    fallbackModel: z.string().min(1),
    rules: z.record(z.string(), z.array(z.string().min(1)).min(1)),
    fallbackEligibility: z.literal('low-confidence-suggestion-only'),
  })
  .strict();

export const exchangeSchema = z.object({
  request: z.record(z.string(), z.unknown()),
  response: z.string().optional(),
  error: z.string().optional(),
  durationMs: z.number().nonnegative(),
});

export const rowSchema = z.object({
  id: z.string(),
  group: z.string(),
  family: z.string(),
  expectedRoute: z.string().nullable(),
  rules: z.object({ status: z.enum(['ready', 'review']), route: z.string().nullable() }),
  primary: proposalSchema,
  cascade: proposalSchema,
  primaryDurationMs: z.number().nonnegative(),
  fallbackExchange: exchangeSchema.nullable(),
});

export const runSchema = z.object({
  format: z.literal(1),
  createdAt: z.iso.datetime(),
  mode: z.enum(['fixture', 'live', 'replay']),
  sourceMode: z.enum(['fixture', 'live']),
  split: z.enum(['development', 'held-out']),
  policy: policySchema,
  datasetHash: z.string(),
  workflowHash: z.string(),
  primaryRunId: z.string(),
  primaryArchiveHash: z.string(),
  cases: z.array(workflowCaseSchema).min(1),
  rows: z.array(rowSchema).min(1),
  report: z.record(z.string(), z.unknown()),
});

export function validateWorkflowCases(values) {
  const cases = z.array(workflowCaseSchema).min(1).parse(values);
  const ids = new Set();
  const families = new Map();
  const requests = new Set();
  for (const entry of cases) {
    if (ids.has(entry.id)) throw new Error('Duplicate workflow case ID.');
    ids.add(entry.id);
    if (requests.has(entry.input.request)) throw new Error('Duplicate workflow request.');
    requests.add(entry.input.request);
    if (families.has(entry.family) && families.get(entry.family) !== entry.split)
      throw new Error('Workflow case family crosses splits.');
    families.set(entry.family, entry.split);
    if (entry.expectedRoute !== null && !Object.hasOwn(entry.input.routes, entry.expectedRoute))
      throw new Error('Expected route is not in the supplied queues.');
  }
  return cases;
}
