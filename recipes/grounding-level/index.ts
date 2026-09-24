import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  groundingLevelInputSchema,
  groundingLevelResultSchema,
  groundingLevelVerdictSchema,
} from './schema.js';
import type { GroundingLevelInput, GroundingLevelResult } from './schema.js';

export async function groundingLevel(
  input: GroundingLevelInput,
  options: RecipeOptions = {},
): Promise<GroundingLevelResult> {
  const { minConfidence = 0.8, ...state } = groundingLevelInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How much of the substantive content in draft is backed by evidence? Consider each factual statement, figure, and recommendation in draft and ask whether evidence states or directly entails it. Ignore greetings, transitions, and other filler. Do not credit statements that are true only from outside knowledge.',
    [
      'None of the substantive statements in draft are supported by evidence.',
      'A minority of the substantive statements in draft are supported by evidence.',
      'About half of the substantive statements in draft are supported by evidence.',
      'Most substantive statements in draft are supported by evidence, with a few unsupported statements.',
      'Every substantive statement in draft is supported by evidence.',
    ],
    options,
  );
  return groundingLevelResultSchema.parse({
    ...decision,
    grounding: groundingLevelVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  groundingLevelInputSchema,
  groundingLevelResultSchema,
  groundingLevelVerdictSchema,
} from './schema.js';
export type { GroundingLevelInput, GroundingLevelResult, GroundingLevelVerdict } from './schema.js';
