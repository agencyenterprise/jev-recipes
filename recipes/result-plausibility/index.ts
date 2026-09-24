import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { resultPlausibilityInputSchema, resultPlausibilityResultSchema } from './schema.js';
import type { ResultPlausibilityInput, ResultPlausibilityResult } from './schema.js';

export async function resultPlausibility(
  input: ResultPlausibilityInput,
  options: RecipeOptions = {},
): Promise<ResultPlausibilityResult> {
  const { minConfidence = 0.8, ...state } = resultPlausibilityInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Is result a plausible, internally consistent answer to request? Count result as implausible when it is an error message, a placeholder or template, empty or near-empty output, repeated or filler values, self-contradictory content, or output about something other than what request asked for, even when it is formatted as valid data. Judge only the supplied result. Do not verify its values against outside knowledge.',
    {
      true: 'The result reads as a genuine, internally consistent answer to the request.',
      false:
        'The result is an error, placeholder, empty, inconsistent, or unrelated output rather than a real answer.',
    },
    options,
  );
  return resultPlausibilityResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'plausible' : 'implausible',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  resultPlausibilityInputSchema,
  resultPlausibilityResultSchema,
  resultPlausibilityVerdictSchema,
} from './schema.js';
export type {
  ResultPlausibilityInput,
  ResultPlausibilityResult,
  ResultPlausibilityVerdict,
} from './schema.js';
