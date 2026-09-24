import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { disclosureFacetsInputSchema, disclosureFacetsResultSchema } from './schema.js';
import type { DisclosureFacetsInput, DisclosureFacetsResult } from './schema.js';

export async function disclosureFacets(
  input: DisclosureFacetsInput,
  options: RecipeOptions = {},
): Promise<DisclosureFacetsResult> {
  const { minConfidence = 0.8, ...state } = disclosureFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesKnownDefects: {
        instruction:
          'Does disclosure address known defects or problems with the property, such as leaks, cracks, pests, or failing systems?',
        criteria: {
          true: 'The text reports at least one defect or problem, or states that the seller knows of none.',
          false: 'The text says nothing about defects or problems with the property.',
        },
      },
      statesPriorRepairs: {
        instruction:
          'Does disclosure address repairs, replacements, or remediation previously done on the property?',
        criteria: {
          true: 'The text describes past repairs, replacements, or remediation work, or states that none was done.',
          false: 'The text says nothing about past repair or remediation work.',
        },
      },
      statesEnvironmentalHazards: {
        instruction:
          'Does disclosure address environmental hazards such as radon, lead paint, asbestos, mold, flooding, or contaminated soil or water?',
        criteria: {
          true: 'The text reports, tests for, or denies knowledge of an environmental hazard on or affecting the property.',
          false: 'The text says nothing about environmental hazards.',
        },
      },
      statesBoundaryIssues: {
        instruction:
          'Does disclosure address property boundaries, encroachments, easements, or rights of way?',
        criteria: {
          true: 'The text mentions a survey, encroachment, easement, shared driveway, boundary dispute, or states that the seller knows of none.',
          false: 'The text says nothing about boundaries, encroachments, or easements.',
        },
      },
      statesAssociationRules: {
        instruction:
          'Does disclosure address a homeowners or condominium association, its dues, or its rules and restrictions?',
        criteria: {
          true: 'The text mentions an association, its fees, its covenants or restrictions, or states that the property is not subject to one.',
          false: 'The text says nothing about an association or its rules.',
        },
      },
    },
    options,
  );
  return disclosureFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  disclosureFacetsInputSchema,
  disclosureFacetsResultSchema,
  disclosureFacetsLabelSchema,
} from './schema.js';
export type {
  DisclosureFacetsInput,
  DisclosureFacetsResult,
  DisclosureFacetsLabel,
} from './schema.js';
