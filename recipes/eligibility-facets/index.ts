import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { eligibilityFacetsInputSchema, eligibilityFacetsResultSchema } from './schema.js';
import type { EligibilityFacetsInput, EligibilityFacetsResult } from './schema.js';

export async function eligibilityFacets(
  input: EligibilityFacetsInput,
  options: RecipeOptions = {},
): Promise<EligibilityFacetsResult> {
  const { minConfidence = 0.8, ...state } = eligibilityFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesResidency: {
        instruction:
          'Does statement address where the applicant lives or how long they have lived there?',
        criteria: {
          true: 'The text gives an address, a city or county of residence, or a length of time at the current residence.',
          false: 'The text says nothing about where or how long the applicant has lived.',
        },
      },
      statesIncome: {
        instruction: "Does statement address the applicant's income, earnings, or lack of income?",
        criteria: {
          true: 'The text states wages, an employer and pay, other income sources, or says the applicant has no income.',
          false: 'The text says nothing about income or earnings.',
        },
      },
      statesHouseholdSize: {
        instruction:
          'Does statement address how many people live in the household or who they are?',
        criteria: {
          true: 'The text gives a number of household members or lists who lives with the applicant.',
          false: 'The text says nothing about the size or members of the household.',
        },
      },
      statesIdentityDocuments: {
        instruction:
          'Does statement address identity documents, such as an ID card, passport, birth certificate, or Social Security card, that the applicant has or has attached?',
        criteria: {
          true: 'The text names an identity document the applicant has, has attached, or lacks.',
          false: 'The text says nothing about identity documents.',
        },
      },
      statesPriorBenefits: {
        instruction:
          'Does statement address benefits the applicant has received before, currently receives, or has never received?',
        criteria: {
          true: 'The text names a benefit or program the applicant has received or receives, or says they have never received benefits.',
          false: 'The text says nothing about prior or current benefits.',
        },
      },
    },
    options,
  );
  return eligibilityFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  eligibilityFacetsInputSchema,
  eligibilityFacetsResultSchema,
  eligibilityFacetsLabelSchema,
} from './schema.js';
export type {
  EligibilityFacetsInput,
  EligibilityFacetsResult,
  EligibilityFacetsLabel,
} from './schema.js';
