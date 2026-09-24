import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  explanationLevelInputSchema,
  explanationLevelResultSchema,
  explanationLevelVerdictSchema,
} from './schema.js';
import type { ExplanationLevelInput, ExplanationLevelResult } from './schema.js';

export async function explanationLevel(
  input: ExplanationLevelInput,
  options: RecipeOptions = {},
): Promise<ExplanationLevelResult> {
  const { minConfidence = 0.8, ...state } = explanationLevelInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How much reasoning does answer show for its conclusion to question? Judge the visible chain from premises to conclusion, not whether the conclusion is correct. Ignore length and restatement of the question.',
    [
      'The answer states a conclusion with no reason given.',
      'The answer states a conclusion and asserts a reason without showing how the reason leads to it.',
      'The answer shows some reasoning steps but leaves gaps a reader must fill to reach the conclusion.',
      'The answer shows a complete chain of steps from premises to conclusion with no gaps.',
      'The answer shows a complete chain and also checks its result or considers and rules out alternatives.',
    ],
    options,
  );
  return explanationLevelResultSchema.parse({
    ...decision,
    explanation: explanationLevelVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  explanationLevelInputSchema,
  explanationLevelResultSchema,
  explanationLevelVerdictSchema,
} from './schema.js';
export type {
  ExplanationLevelInput,
  ExplanationLevelResult,
  ExplanationLevelVerdict,
} from './schema.js';
