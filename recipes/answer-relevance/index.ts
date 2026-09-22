import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { answerRelevanceInputSchema, answerRelevanceResultSchema } from './schema.js';
import type { AnswerRelevanceInput, AnswerRelevanceResult } from './schema.js';

export async function answerRelevance(
  input: AnswerRelevanceInput,
  options: RecipeOptions = {},
): Promise<AnswerRelevanceResult> {
  const { minConfidence = 0.8, ...state } = answerRelevanceInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'How directly does draft address request? Judge alignment with the requested subject and task, not factual correctness or completeness.',
    {
      relevant: 'The draft directly addresses the requested subject and task.',
      partly_relevant:
        'The draft mixes relevant content with a substantial unrelated tangent or addresses a neighboring task.',
      off_topic: 'The draft does not address the requested subject or task.',
      unclear: 'The request or draft is too ambiguous to assess alignment.',
    },
    options,
  );
  return answerRelevanceResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  answerRelevanceInputSchema,
  answerRelevanceResultSchema,
  answerRelevanceVerdictSchema,
} from './schema.js';
export type {
  AnswerRelevanceInput,
  AnswerRelevanceResult,
  AnswerRelevanceVerdict,
} from './schema.js';
