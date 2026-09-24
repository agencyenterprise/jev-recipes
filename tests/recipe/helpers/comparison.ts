import type { RecipeOptions } from '../../../src/schema.js';
import { testClassification } from './classification.js';

export const comparisonLabels = ['first', 'second', 'tie', 'neither', 'unclear'] as const;

export function testComparison<Input extends Record<string, unknown>>(
  run: (
    input: Input,
    options?: RecipeOptions,
  ) => Promise<{
    status: string;
    verdict: string;
    confidence: number;
    probabilities: Record<string, number>;
  }>,
  input: Input,
  optionalFields: readonly string[] = [],
) {
  testClassification(run, input, comparisonLabels, optionalFields);
}
