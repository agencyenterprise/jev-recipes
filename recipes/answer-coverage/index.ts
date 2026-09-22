import { evaluateChecks } from '../../src/checks.js';
import type { RecipeOptions } from '../../src/schema.js';
import { answerCoverageInputSchema, answerCoverageResultSchema } from './schema.js';
import type { AnswerCoverageInput, AnswerCoverageResult } from './schema.js';

export async function answerCoverage(
  input: AnswerCoverageInput,
  options: RecipeOptions = {},
): Promise<AnswerCoverageResult> {
  const { minConfidence = 0.8, ...state } = answerCoverageInputSchema.parse(input);
  const evaluation = await evaluateChecks(
    state,
    state.questions,
    (index) =>
      `Does draft answer the entire question in questions[${index}].text? Assess coverage, not factual truth. A relevant acknowledgment without an answer is missing.`,
    {
      answered: 'Every material part of this question is answered.',
      partial: 'Some material parts are answered but others are missing.',
      missing: 'No substantive answer to this question appears.',
      unclear: 'The wording prevents a reliable coverage decision.',
    },
    options,
  );
  const checks = evaluation.checks.map((check) => ({
    ...check,
    status: check.confidence < minConfidence || check.verdict === 'unclear' ? 'review' : 'ready',
  }));
  return answerCoverageResultSchema.parse({
    ...evaluation,
    checks,
    status: checks.some((check) => check.status === 'review') ? 'review' : 'ready',
    allAnswered: checks.every((check) => check.status === 'ready' && check.verdict === 'answered'),
  });
}

export {
  answerCoverageInputSchema,
  answerCoverageResultSchema,
  answerCoverageVerdictSchema,
} from './schema.js';
export type { AnswerCoverageInput, AnswerCoverageResult, AnswerCoverageVerdict } from './schema.js';
