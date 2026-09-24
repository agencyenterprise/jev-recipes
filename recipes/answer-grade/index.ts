import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  answerGradeInputSchema,
  answerGradeResultSchema,
  answerGradeVerdictSchema,
} from './schema.js';
import type { AnswerGradeInput, AnswerGradeResult } from './schema.js';

export async function answerGrade(
  input: AnswerGradeInput,
  options: RecipeOptions = {},
): Promise<AnswerGradeResult> {
  const { minConfidence = 0.8, ...state } = answerGradeInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How well does answer meet rubric as a response to question? Judge only against the criteria rubric states. Ignore length, style, and effort unless rubric names them. Do not reward content that rubric does not ask for.',
    [
      'The answer meets none of the rubric criteria or does not address the question.',
      'The answer meets a small part of one or two rubric criteria and misses the rest.',
      'The answer meets some rubric criteria fully but leaves major criteria unmet.',
      'The answer meets most rubric criteria with only minor omissions or errors.',
      'The answer meets every rubric criterion without omissions or errors.',
    ],
    options,
  );
  return answerGradeResultSchema.parse({
    ...decision,
    grade: answerGradeVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  answerGradeInputSchema,
  answerGradeResultSchema,
  answerGradeVerdictSchema,
} from './schema.js';
export type { AnswerGradeInput, AnswerGradeResult, AnswerGradeVerdict } from './schema.js';
