import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { proposalFacetsInputSchema, proposalFacetsResultSchema } from './schema.js';
import type { ProposalFacetsInput, ProposalFacetsResult } from './schema.js';

export async function proposalFacets(
  input: ProposalFacetsInput,
  options: RecipeOptions = {},
): Promise<ProposalFacetsResult> {
  const { minConfidence = 0.8, ...state } = proposalFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesNeed: {
        instruction:
          'Does proposal describe the problem, gap, or population condition that the proposed work addresses?',
        criteria: {
          true: 'The proposal describes a specific problem or gap, with or without supporting figures, that the work is meant to address.',
          false:
            'The proposal describes only what it will do or who the applicant is, without saying what problem the work addresses.',
        },
      },
      statesObjectives: {
        instruction:
          'Does proposal state at least one objective with a measurable target, such as a number served, a percentage change, or an observable outcome by a stated point?',
        criteria: {
          true: 'The proposal states at least one intended outcome with a number, percentage, or other observable target.',
          false:
            'The proposal states goals only in general terms, such as improving lives or raising awareness, with no measurable target.',
        },
      },
      statesActivities: {
        instruction:
          'Does proposal describe the specific activities the applicant will carry out, such as sessions, services, events, or deliverables?',
        criteria: {
          true: 'The proposal names concrete activities the applicant will perform, with at least some detail on what, who, or how often.',
          false:
            'The proposal names no specific activities, or describes the work only as a program or initiative without saying what will be done.',
        },
      },
      statesBudget: {
        instruction:
          'Does proposal give the cost of the work, as a requested amount, a total budget, line items, or a combination?',
        criteria: {
          true: 'The proposal states at least one monetary figure for what the work will cost or what is requested.',
          false: 'The proposal gives no monetary figure for the work.',
        },
      },
      statesEvaluation: {
        instruction:
          'Does proposal say how the applicant will measure or assess whether the objectives were achieved, such as assessments, surveys, data collection, or a comparison?',
        criteria: {
          true: 'The proposal describes at least one method, instrument, or data source it will use to judge whether the work achieved its objectives.',
          false:
            'The proposal states objectives or outcomes without saying how their achievement will be measured or assessed.',
        },
      },
    },
    options,
  );
  return proposalFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  proposalFacetsInputSchema,
  proposalFacetsResultSchema,
  proposalFacetsLabelSchema,
} from './schema.js';
export type { ProposalFacetsInput, ProposalFacetsResult, ProposalFacetsLabel } from './schema.js';
