import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  forecastConfidenceWordingInputSchema,
  forecastConfidenceWordingResultSchema,
  forecastConfidenceWordingVerdictSchema,
} from './schema.js';
import type { ForecastConfidenceWordingInput, ForecastConfidenceWordingResult } from './schema.js';

export async function forecastConfidenceWording(
  input: ForecastConfidenceWordingInput,
  options: RecipeOptions = {},
): Promise<ForecastConfidenceWordingResult> {
  const { minConfidence = 0.8, ...state } = forecastConfidenceWordingInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'Read the statement, a projection about a financial outcome such as revenue, price, return, or growth, and grade how certain its wording is. Look at hedges, conditionals, ranges, attributions to assumptions, and whether the outcome is presented as possible, likely, or as a settled fact. Judge the wording alone, not whether the projection is plausible.',
    [
      'The statement explicitly marks the projection as a guess or scenario, using words like could, might, if, or in one scenario, and gives no indication that the outcome is expected.',
      'The statement leans toward an outcome but wraps it in qualifiers, ranges, or stated assumptions that make clear it may not happen.',
      'The statement presents the projection as a reasonable expectation while naming at least one specific way it could fall short.',
      'The statement presents the outcome as expected, using words like will likely, on track to, or we expect, with little or no acknowledgment of downside.',
      'The statement presents the projection as a settled fact with no hedge, condition, or acknowledgment that it is a prediction.',
    ],
    options,
  );
  return forecastConfidenceWordingResultSchema.parse({
    ...decision,
    certainty: forecastConfidenceWordingVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  forecastConfidenceWordingInputSchema,
  forecastConfidenceWordingResultSchema,
  forecastConfidenceWordingVerdictSchema,
} from './schema.js';
export type {
  ForecastConfidenceWordingInput,
  ForecastConfidenceWordingResult,
  ForecastConfidenceWordingVerdict,
} from './schema.js';
