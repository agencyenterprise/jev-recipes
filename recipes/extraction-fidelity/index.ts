import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  extractionFidelityInputSchema,
  extractionFidelityResultSchema,
  extractionFidelityVerdictSchema,
} from './schema.js';
import type { ExtractionFidelityInput, ExtractionFidelityResult } from './schema.js';

export async function extractionFidelity(
  input: ExtractionFidelityInput,
  options: RecipeOptions = {},
): Promise<ExtractionFidelityResult> {
  const { minConfidence = 0.8, ...state } = extractionFidelityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How faithfully does extracted represent the facts stated in source? Compare every value in extracted against source and look for invented values, altered values, and facts from source that extracted drops. Judge only against source, not against outside knowledge.',
    [
      'Most values in extracted are invented or contradict source.',
      'Several values in extracted are wrong or missing, so it misrepresents source in material ways.',
      'Most values in extracted match source, but at least one value is wrong or a material fact is missing.',
      'Every value in extracted matches source, with only minor facts from source omitted.',
      'Every value in extracted matches source and no fact stated in source is omitted.',
    ],
    options,
  );
  return extractionFidelityResultSchema.parse({
    ...decision,
    fidelity: extractionFidelityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  extractionFidelityInputSchema,
  extractionFidelityResultSchema,
  extractionFidelityVerdictSchema,
} from './schema.js';
export type {
  ExtractionFidelityInput,
  ExtractionFidelityResult,
  ExtractionFidelityVerdict,
} from './schema.js';
