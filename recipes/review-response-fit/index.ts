import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { reviewResponseFitInputSchema, reviewResponseFitResultSchema } from './schema.js';
import type { ReviewResponseFitInput, ReviewResponseFitResult } from './schema.js';

export async function reviewResponseFit(
  input: ReviewResponseFitInput,
  options: RecipeOptions = {},
): Promise<ReviewResponseFitResult> {
  const { minConfidence = 0.8, ...state } = reviewResponseFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Judge whether response addresses the specific complaints and praise raised in review. A response addresses the review when it refers to the particular issues or compliments the reviewer raised, even briefly. A response is generic when it could be posted under any review: a thank-you, a general apology, or an invitation to return with no reference to what this reviewer said. Ignore tone, length, and whether the response offers compensation.',
    {
      true: 'The response refers to the specific complaints or praise in the review, such as naming the problem the reviewer described or the thing they liked.',
      false:
        'The response contains only general thanks, apology, or marketing language that does not refer to anything particular in the review.',
    },
    options,
  );
  return reviewResponseFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'addresses' : 'generic',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  reviewResponseFitInputSchema,
  reviewResponseFitResultSchema,
  reviewResponseFitVerdictSchema,
} from './schema.js';
export type {
  ReviewResponseFitInput,
  ReviewResponseFitResult,
  ReviewResponseFitVerdict,
} from './schema.js';
