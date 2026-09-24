import { noul } from '@typesafe-ai/sdk';
import { evaluateWithJev } from './client.js';
import { parseYesProbability } from './answers.js';
import { asDecisionInstruction, parseDecisionState } from './decisions.js';
import { labelQuestionsSchema } from './schema.js';
import type { LabelCheck, LabelQuestions, RecipeOptions } from './schema.js';

export async function evaluateLabels<Name extends string>(
  state: Record<string, unknown>,
  labels: Record<Name, LabelQuestions[string]>,
  options: RecipeOptions = {},
) {
  const definitions = labelQuestionsSchema.parse(labels) as Record<Name, LabelQuestions[string]>;
  const names = Object.keys(definitions) as Name[];
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: Object.fromEntries(
        names.map((name) => [
          name,
          noul(asDecisionInstruction(definitions[name].instruction), definitions[name].criteria),
        ]),
      ),
    },
    options,
  );
  const measurements = Object.fromEntries(
    names.map((name) => {
      const probability = parseYesProbability(response.answers[name]);
      return [name, { probability, confidence: Math.max(probability, 1 - probability) }];
    }),
  ) as Record<Name, { probability: number; confidence: number }>;
  return { labels: measurements, model: response.model, usage: response.usage };
}

export function resolveLabels<Name extends string>(
  measurements: Record<Name, { probability: number; confidence: number }>,
  minConfidence: number,
) {
  const names = Object.keys(measurements) as Name[];
  const labels = Object.fromEntries(
    names.map((name) => {
      const measurement = measurements[name];
      return [
        name,
        {
          ...measurement,
          verdict: measurement.probability >= 0.5 ? 'present' : 'absent',
          status: measurement.confidence < minConfidence ? 'review' : 'ready',
        },
      ];
    }),
  ) as Record<Name, LabelCheck>;
  return {
    labels,
    status: names.some((name) => labels[name].status === 'review') ? 'review' : 'ready',
    detected: names.filter((name) => labels[name].verdict === 'present'),
  };
}
