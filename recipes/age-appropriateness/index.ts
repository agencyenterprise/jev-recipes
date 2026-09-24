import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  ageAppropriatenessInputSchema,
  ageAppropriatenessResultSchema,
  ageAppropriatenessVerdictSchema,
} from './schema.js';
import type { AgeAppropriatenessInput, AgeAppropriatenessResult } from './schema.js';

export async function ageAppropriateness(
  input: AgeAppropriatenessInput,
  options: RecipeOptions = {},
): Promise<AgeAppropriatenessResult> {
  const { minConfidence = 0.8, ...state } = ageAppropriatenessInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'What is the youngest general audience for which content is appropriate, given any context? Judge the themes, language, and depictions as written. Ignore the length and quality of the writing.',
    [
      'Suitable for all ages, with no coarse language, peril, or mature themes.',
      'Suitable for older children; may include mild language, mild peril, or cartoonish conflict.',
      'Suitable for teens; mature themes such as romance, violence, or substance use are handled non-graphically.',
      'Suitable for mature audiences; includes graphic violence, sexual content, or drug use.',
      'Suitable for adults only; includes explicit sexual content or extreme depictions.',
    ],
    options,
  );
  return ageAppropriatenessResultSchema.parse({
    ...decision,
    rating: ageAppropriatenessVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  ageAppropriatenessInputSchema,
  ageAppropriatenessResultSchema,
  ageAppropriatenessVerdictSchema,
} from './schema.js';
export type {
  AgeAppropriatenessInput,
  AgeAppropriatenessResult,
  AgeAppropriatenessVerdict,
} from './schema.js';
