import { z } from 'zod';
import {
  nonEmptyText,
  probability,
  decisionStatusSchema,
  resultMetadataSchema,
} from '../../src/schema.js';

export const motivationSourceVerdictSchema = z.enum([
  'intrinsic',
  'extrinsic',
  'mixed',
  'not_stated',
  'unclear',
]);
export const motivationSourceInputSchema = z.object({
  activity: nonEmptyText.describe(
    'One focal activity and its actor when needed to distinguish whose stated reason is being classified.',
  ),
  statement: nonEmptyText.describe('Text stating or reporting why the actor does the activity.'),
  context: nonEmptyText
    .describe('Supplied speaker identities or references needed to interpret the stated reason.')
    .optional(),
  minConfidence: probability.optional(),
});
export const motivationSourceResultSchema = resultMetadataSchema.extend({
  status: decisionStatusSchema,
  verdict: motivationSourceVerdictSchema,
  confidence: probability,
  probabilities: z.record(motivationSourceVerdictSchema, probability),
});
export type MotivationSourceInput = z.infer<typeof motivationSourceInputSchema>;
export type MotivationSourceResult = z.infer<typeof motivationSourceResultSchema>;
export type MotivationSourceVerdict = z.infer<typeof motivationSourceVerdictSchema>;
