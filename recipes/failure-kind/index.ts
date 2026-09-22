import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { failureKindInputSchema } from './schema.js';
import type { FailureKindInput, FailureKindResult } from './schema.js';

export async function failureKind(
  input: FailureKindInput,
  options: RecipeOptions = {},
): Promise<FailureKindResult> {
  const { minConfidence = 0.8, ...state } = failureKindInputSchema.parse(input);
  return selectCandidate(
    state,
    state.categories,
    'Which supplied category best describes the observed failure? Classify the described failure rather than inventing an underlying cause.',
    minConfidence,
    options,
  );
}

export { failureKindInputSchema, failureKindResultSchema } from './schema.js';
export type { FailureKindInput, FailureKindResult } from './schema.js';
