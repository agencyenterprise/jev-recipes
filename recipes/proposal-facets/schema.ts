import { z } from 'zod';
import {
  labelCheckSchema,
  labelsResultSchema,
  nonEmptyText,
  probability,
} from '../../src/schema.js';

export const proposalFacetsLabelSchema = z.enum([
  'statesNeed',
  'statesObjectives',
  'statesActivities',
  'statesBudget',
  'statesEvaluation',
]);
export const proposalFacetsInputSchema = z.object({
  proposal: nonEmptyText,
  minConfidence: probability.optional(),
});
export const proposalFacetsResultSchema = labelsResultSchema.extend({
  detected: z.array(proposalFacetsLabelSchema),
  labels: z.object({
    statesNeed: labelCheckSchema,
    statesObjectives: labelCheckSchema,
    statesActivities: labelCheckSchema,
    statesBudget: labelCheckSchema,
    statesEvaluation: labelCheckSchema,
  }),
});

export type ProposalFacetsLabel = z.infer<typeof proposalFacetsLabelSchema>;
export type ProposalFacetsInput = z.infer<typeof proposalFacetsInputSchema>;
export type ProposalFacetsResult = z.infer<typeof proposalFacetsResultSchema>;
