import { score } from '@typesafe-ai/sdk';
import { evaluateWithJev } from './client.js';
import { parseScoreAnswer } from './answers.js';
import { asDecisionInstruction, parseDecisionState } from './decisions.js';
import { rubricSchema } from './schema.js';
import type { RecipeOptions, Rubric } from './schema.js';

export async function evaluateScore(
  state: Record<string, unknown>,
  instruction: string,
  rubric: Rubric,
  options: RecipeOptions = {},
  questionName = 'score',
) {
  const levels = rubricSchema.parse(rubric);
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: { [questionName]: score(asScoreInstruction(instruction, levels), levels) },
    },
    options,
  );
  const answer = parseScoreAnswer(response.answers[questionName], levels.length);
  return {
    score: answer.score,
    level: answer.level,
    confidence: answer.confidence,
    probabilities: answer.probabilities,
    model: response.model,
    usage: response.usage,
  };
}

export function asScoreInstruction(instruction: string, levels: Rubric): string {
  return asDecisionInstruction(
    `${instruction} Score from 0 to ${levels.length - 1} using only the supplied rubric levels.`,
  );
}
