import { noul } from '@typesafe-ai/sdk';
import { evaluateWithJev } from './client.js';
import { parseYesProbability } from './answers.js';
import { asDecisionInstruction, parseDecisionState } from './decisions.js';
import { gateCriteriaSchema } from './schema.js';
import type { GateCriteria, RecipeOptions } from './schema.js';

export async function evaluateGate(
  state: Record<string, unknown>,
  instruction: string,
  criteria: GateCriteria,
  options: RecipeOptions = {},
  questionName = 'gate',
) {
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: {
        [questionName]: noul(
          asDecisionInstruction(instruction),
          gateCriteriaSchema.parse(criteria),
        ),
      },
    },
    options,
  );
  const probability = parseYesProbability(response.answers[questionName]);
  return {
    probability,
    confidence: Math.max(probability, 1 - probability),
    model: response.model,
    usage: response.usage,
  };
}
