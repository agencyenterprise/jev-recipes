import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { reviewFacetsInputSchema, reviewFacetsResultSchema } from './schema.js';
import type { ReviewFacetsInput, ReviewFacetsResult } from './schema.js';

export async function reviewFacets(
  input: ReviewFacetsInput,
  options: RecipeOptions = {},
): Promise<ReviewFacetsResult> {
  const { minConfidence = 0.8, ...state } = reviewFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      mentionsQuality: {
        instruction:
          'Does review comment on the quality of the product itself, such as materials, build, durability, performance, taste, or how well it works?',
        criteria: {
          true: 'The review comments on the quality or performance of the product.',
          false: 'The review says nothing about product quality or performance.',
        },
      },
      mentionsPrice: {
        instruction:
          'Does review comment on the price, cost, value for money, or a discount or deal?',
        criteria: {
          true: 'The review comments on price or value for money.',
          false: 'The review says nothing about price or value.',
        },
      },
      mentionsShipping: {
        instruction:
          'Does review comment on shipping, delivery speed, packaging, or the condition the parcel arrived in?',
        criteria: {
          true: 'The review comments on shipping, delivery, or packaging.',
          false: 'The review says nothing about shipping, delivery, or packaging.',
        },
      },
      mentionsService: {
        instruction:
          'Does review comment on customer service, support, returns handling, or interaction with the seller or staff?',
        criteria: {
          true: 'The review comments on customer service or the seller interaction.',
          false: 'The review says nothing about customer service or the seller.',
        },
      },
      reportsDefect: {
        instruction:
          'Does review report that the product was broken, damaged, missing parts, malfunctioning, or otherwise not working as intended?',
        criteria: {
          true: 'The review reports a specific defect or malfunction in the product received.',
          false: 'The review reports no defect; general dissatisfaction alone does not count.',
        },
      },
    },
    options,
  );
  return reviewFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  reviewFacetsInputSchema,
  reviewFacetsResultSchema,
  reviewFacetsLabelSchema,
} from './schema.js';
export type { ReviewFacetsInput, ReviewFacetsResult, ReviewFacetsLabel } from './schema.js';
