import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  commitmentStrengthInputSchema,
  commitmentStrengthResultSchema,
  commitmentStrengthVerdictSchema,
} from './schema.js';
import type { CommitmentStrengthInput, CommitmentStrengthResult } from './schema.js';

export async function commitmentStrength(
  input: CommitmentStrengthInput,
  options: RecipeOptions = {},
): Promise<CommitmentStrengthResult> {
  const { minConfidence = 0.8, ...state } = commitmentStrengthInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How firmly does statement commit its speaker to an action or outcome, given any context? Judge the expressed wording only, not whether the speaker will follow through.',
    [
      'The wording makes no commitment or explicitly refuses.',
      'The wording raises a vague possibility with no stated intention to act.',
      'The wording states an intention hedged by conditions, caveats, or uncertainty.',
      'The wording states a firm intention to act without specific terms.',
      'The wording makes a binding promise with specific terms such as what, when, or how.',
    ],
    options,
  );
  return commitmentStrengthResultSchema.parse({
    ...decision,
    commitment: commitmentStrengthVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  commitmentStrengthInputSchema,
  commitmentStrengthResultSchema,
  commitmentStrengthVerdictSchema,
} from './schema.js';
export type {
  CommitmentStrengthInput,
  CommitmentStrengthResult,
  CommitmentStrengthVerdict,
} from './schema.js';
