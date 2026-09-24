import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  noveltyClaimLevelInputSchema,
  noveltyClaimLevelResultSchema,
  noveltyClaimLevelVerdictSchema,
} from './schema.js';
import type { NoveltyClaimLevelInput, NoveltyClaimLevelResult } from './schema.js';

export async function noveltyClaimLevel(
  input: NoveltyClaimLevelInput,
  options: RecipeOptions = {},
): Promise<NoveltyClaimLevelResult> {
  const { minConfidence = 0.8, ...state } = noveltyClaimLevelInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How strongly does the wording of statement claim novelty for the contribution it describes? Judge only the strength of the novelty language: words such as extend, build on, new, novel, first, unprecedented, and phrases such as to our knowledge or no prior work. Do not judge whether the claim is true, how important the contribution is, or how confident the author sounds about the results.',
    [
      'The statement describes the work without claiming it is new, such as a replication, a summary, or a description of method with no comparison to prior work.',
      'The statement positions the work as an extension, refinement, or variant of prior work, using words such as extend, adapt, or build on.',
      'The statement calls the contribution new or novel in some respect while acknowledging related prior work exists.',
      'The statement claims a major advance or a new approach that departs from existing work, without claiming to be the first.',
      'The statement claims the contribution is the first of its kind, unprecedented, or unaddressed by any prior work, often with phrases such as to our knowledge or no previous study.',
    ],
    options,
  );
  return noveltyClaimLevelResultSchema.parse({
    ...decision,
    novelty: noveltyClaimLevelVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  noveltyClaimLevelInputSchema,
  noveltyClaimLevelResultSchema,
  noveltyClaimLevelVerdictSchema,
} from './schema.js';
export type {
  NoveltyClaimLevelInput,
  NoveltyClaimLevelResult,
  NoveltyClaimLevelVerdict,
} from './schema.js';
