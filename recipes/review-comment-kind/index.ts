import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { reviewCommentKindInputSchema, reviewCommentKindResultSchema } from './schema.js';
import type { ReviewCommentKindInput, ReviewCommentKindResult } from './schema.js';

export async function reviewCommentKind(
  input: ReviewCommentKindInput,
  options: RecipeOptions = {},
): Promise<ReviewCommentKindResult> {
  const { minConfidence = 0.8, ...state } = reviewCommentKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What is the primary kind of comment, given any context? Judge what the reviewer is mainly asking the author to do or notice, not the tone or length of the wording.',
    {
      bug: 'The comment points at incorrect behavior, a defect, or a case the code handles wrongly.',
      design:
        'The comment concerns structure, architecture, or the overall approach rather than a specific defect.',
      style: 'The comment concerns naming, formatting, or idiom without changing behavior.',
      question: 'The comment asks for clarification or explanation without asserting a problem.',
      nit: 'The comment suggests trivial optional polish that the author may ignore.',
      praise: 'The comment expresses approval or appreciation without requesting a change.',
      unclear: 'The primary kind of the comment is not established by the supplied text.',
    },
    options,
  );
  return reviewCommentKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  reviewCommentKindInputSchema,
  reviewCommentKindResultSchema,
  reviewCommentKindVerdictSchema,
} from './schema.js';
export type {
  ReviewCommentKindInput,
  ReviewCommentKindResult,
  ReviewCommentKindVerdict,
} from './schema.js';
