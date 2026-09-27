import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const diffHazardsLabelSchema = z.enum([
  'secretLeak',
  'destructiveCommand',
  'debugLeftover',
  'testsWeakened',
  'dependencyChange',
]);
export const diffHazardsInputSchema = z.object({
  diff: nonEmptyText,
  context: nonEmptyText.optional(),
  minConfidence: probability.optional(),
});
export const diffHazardsResultSchema = labelsResultSchema.extend({
  detected: z.array(diffHazardsLabelSchema),
  labels: z.object({
    secretLeak: labelCheckSchema,
    destructiveCommand: labelCheckSchema,
    debugLeftover: labelCheckSchema,
    testsWeakened: labelCheckSchema,
    dependencyChange: labelCheckSchema,
  }),
});

export type DiffHazardsLabel = z.infer<typeof diffHazardsLabelSchema>;
export type DiffHazardsInput = z.infer<typeof diffHazardsInputSchema>;
export type DiffHazardsResult = z.infer<typeof diffHazardsResultSchema>;
