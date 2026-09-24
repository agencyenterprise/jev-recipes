import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  reviewRecommendationKindInputSchema,
  reviewRecommendationKindResultSchema,
} from './schema.js';
import type { ReviewRecommendationKindInput, ReviewRecommendationKindResult } from './schema.js';

export async function reviewRecommendationKind(
  input: ReviewRecommendationKindInput,
  options: RecipeOptions = {},
): Promise<ReviewRecommendationKindResult> {
  const { minConfidence = 0.8, ...state } = reviewRecommendationKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "Read review and decide which recommendation its wording expresses about the manuscript. Judge by what the reviewer says must happen before publication: nothing, small fixes, substantial new work or rewriting, or that it should not be published. Weigh the reviewer's stated conditions over the amount of praise or criticism. Use unclear when the text lists observations without committing to any disposition.",
    {
      accept:
        'The reviewer says the manuscript can be published as is or with only optional or cosmetic changes.',
      minor_revision:
        'The reviewer supports publication once specific small fixes are made, such as clarifications, typos, missing references, or presentation changes, without new experiments or analysis.',
      major_revision:
        'The reviewer withholds support until substantial new work is done, such as new experiments, reanalysis, addressing a flawed assumption, or significant restructuring, but does not rule out eventual publication.',
      reject:
        'The reviewer says the manuscript should not be published, or describes flaws it says cannot be fixed by revision.',
      unclear:
        'The review lists observations, questions, or mixed remarks without committing to what should happen to the manuscript.',
    },
    options,
  );
  return reviewRecommendationKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  reviewRecommendationKindInputSchema,
  reviewRecommendationKindResultSchema,
  reviewRecommendationKindVerdictSchema,
} from './schema.js';
export type {
  ReviewRecommendationKindInput,
  ReviewRecommendationKindResult,
  ReviewRecommendationKindVerdict,
} from './schema.js';
