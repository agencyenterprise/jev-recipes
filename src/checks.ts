import { choice } from '@typesafe-ai/sdk';
import { evaluateWithJev } from './client.js';
import { parseChoiceAnswer } from './answers.js';
import { asDecisionInstruction, parseDecisionState } from './decisions.js';
import type { RecipeOptions, IdentifiedItem } from './schema.js';

export async function evaluateChecks(
  state: Record<string, unknown>,
  items: IdentifiedItem[],
  instruction: (index: number) => string,
  criteria: Record<string, string>,
  options: RecipeOptions = {},
  questionPrefix = 'check',
) {
  const questions = Object.fromEntries(
    items.map((_, index) => [
      `${questionPrefix}_${index}`,
      choice(asDecisionInstruction(instruction(index)), criteria),
    ]),
  );
  const response = await evaluateWithJev({ state: parseDecisionState(state), questions }, options);
  const checks = items.map((item, index) => {
    const answer = parseChoiceAnswer(
      response.answers[`${questionPrefix}_${index}`],
      Object.keys(criteria),
    );
    return {
      id: item.id,
      verdict: answer.choice,
      confidence: answer.confidence,
      probabilities: answer.probabilities,
    };
  });
  return { checks, model: response.model, usage: response.usage };
}
