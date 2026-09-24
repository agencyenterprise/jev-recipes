import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  feedbackActionabilityInputSchema,
  feedbackActionabilityResultSchema,
  feedbackActionabilityVerdictSchema,
} from './schema.js';
import type { FeedbackActionabilityInput, FeedbackActionabilityResult } from './schema.js';

export async function feedbackActionability(
  input: FeedbackActionabilityInput,
  options: RecipeOptions = {},
): Promise<FeedbackActionabilityResult> {
  const { minConfidence = 0.8, ...state } = feedbackActionabilityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How actionable is feedback for the person receiving it? Judge whether the recipient could act on it without asking follow-up questions. Ignore tone, politeness, and whether the feedback is correct.',
    [
      'The feedback only praises or complains and gives no direction to change anything.',
      'The feedback gestures at improvement in general terms without saying what to change.',
      'The feedback identifies what to change but not how to change it or why.',
      'The feedback names a specific change and gives the reason it matters.',
      'The feedback names a specific change, gives the reason, and includes an example or a concrete next step.',
    ],
    options,
  );
  return feedbackActionabilityResultSchema.parse({
    ...decision,
    actionability: feedbackActionabilityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  feedbackActionabilityInputSchema,
  feedbackActionabilityResultSchema,
  feedbackActionabilityVerdictSchema,
} from './schema.js';
export type {
  FeedbackActionabilityInput,
  FeedbackActionabilityResult,
  FeedbackActionabilityVerdict,
} from './schema.js';
