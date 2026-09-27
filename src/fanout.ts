import { choice, noul } from '@typesafe-ai/sdk';
import { evaluateWithJev } from './client.js';
import { parseChoiceAnswer, parseYesProbability } from './answers.js';
import { asDecisionInstruction, parseDecisionState } from './decisions.js';
import { labelQuestionsSchema } from './schema.js';
import type { LabelQuestions, RecipeOptions } from './schema.js';

/**
 * One request that carries a choice question plus several independent yes/no
 * labels. System One models answer every question in parallel, so the labels
 * add no latency compared with the choice alone.
 */
export async function evaluateChoiceWithLabels<Name extends string>(
  state: Record<string, unknown>,
  instruction: string,
  criteria: Record<string, string>,
  labels: Record<Name, LabelQuestions[string]>,
  options: RecipeOptions = {},
  questionName = 'decision',
) {
  const definitions = labelQuestionsSchema.parse(labels) as Record<Name, LabelQuestions[string]>;
  const names = Object.keys(definitions) as Name[];
  if (names.includes(questionName as Name))
    throw new Error(`Label names must not include the choice question name "${questionName}".`);
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: {
        [questionName]: choice(asDecisionInstruction(instruction), criteria),
        ...Object.fromEntries(
          names.map((name) => [
            name,
            noul(asDecisionInstruction(definitions[name].instruction), definitions[name].criteria),
          ]),
        ),
      },
    },
    options,
  );
  const answer = parseChoiceAnswer(response.answers[questionName], Object.keys(criteria));
  const measurements = Object.fromEntries(
    names.map((name) => {
      const probability = parseYesProbability(response.answers[name]);
      return [name, { probability, confidence: Math.max(probability, 1 - probability) }];
    }),
  ) as Record<Name, { probability: number; confidence: number }>;
  return {
    verdict: answer.choice,
    confidence: answer.confidence,
    probabilities: answer.probabilities,
    labels: measurements,
    model: response.model,
    usage: response.usage,
  };
}
