import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { feedbackKindInputSchema, feedbackKindResultSchema } from './schema.js';
import type { FeedbackKindInput, FeedbackKindResult } from './schema.js';

export async function feedbackKind(
  input: FeedbackKindInput,
  options: RecipeOptions = {},
): Promise<FeedbackKindResult> {
  const { minConfidence = 0.8, ...state } = feedbackKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What is the primary kind of feedback in message? Prefer the explicit requested outcome over incidental tone. Choose unclear when several kinds are equally central.',
    {
      bug_report: 'Reports existing functionality behaving incorrectly.',
      feature_request: 'Requests a new capability or changed behavior.',
      question: 'Asks for information or instructions.',
      praise: 'Primarily expresses positive feedback without another requested outcome.',
      complaint:
        'Primarily expresses dissatisfaction without a specific bug report, feature request, or question.',
      other: 'The feedback has a clear purpose outside these categories.',
      unclear: 'The primary kind cannot be established.',
    },
    options,
  );
  return feedbackKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  feedbackKindInputSchema,
  feedbackKindResultSchema,
  feedbackKindVerdictSchema,
} from './schema.js';
export type { FeedbackKindInput, FeedbackKindResult, FeedbackKindVerdict } from './schema.js';
