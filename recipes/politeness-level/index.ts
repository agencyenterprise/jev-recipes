import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  politenessLevelInputSchema,
  politenessLevelResultSchema,
  politenessLevelVerdictSchema,
} from './schema.js';
import type { PolitenessLevelInput, PolitenessLevelResult } from './schema.js';

export async function politenessLevel(
  input: PolitenessLevelInput,
  options: RecipeOptions = {},
): Promise<PolitenessLevelResult> {
  const { minConfidence = 0.8, ...state } = politenessLevelInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    "How polite is the wording of message toward its recipient, given any context? Judge the expressed wording only, not the writer's intent or the recipient's reaction.",
    [
      'The wording is hostile or insulting toward the recipient.',
      'The wording is curt or dismissive, with no softening or courtesy.',
      'The wording is neutral and businesslike, neither rude nor notably courteous.',
      'The wording is courteous, using greetings, thanks, or softened requests.',
      'The wording is deferential or effusively polite, with repeated thanks, apologies, or honorifics.',
    ],
    options,
  );
  return politenessLevelResultSchema.parse({
    ...decision,
    politeness: politenessLevelVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  politenessLevelInputSchema,
  politenessLevelResultSchema,
  politenessLevelVerdictSchema,
} from './schema.js';
export type {
  PolitenessLevelInput,
  PolitenessLevelResult,
  PolitenessLevelVerdict,
} from './schema.js';
