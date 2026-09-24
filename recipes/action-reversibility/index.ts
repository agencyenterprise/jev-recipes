import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  actionReversibilityInputSchema,
  actionReversibilityResultSchema,
  actionReversibilityVerdictSchema,
} from './schema.js';
import type { ActionReversibilityInput, ActionReversibilityResult } from './schema.js';

export async function actionReversibility(
  input: ActionReversibilityInput,
  options: RecipeOptions = {},
): Promise<ActionReversibilityResult> {
  const { minConfidence = 0.8, ...state } = actionReversibilityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How reversible is action, given any context? Judge whether its effects can be undone, how much work undoing would take, and whether any effect reaches outside the system where it can no longer be recalled. Grade the action as described, not whether it should be taken.',
    [
      'The action can be undone in a single step, has no lasting effect, and nothing leaves the system, such as a local edit or a change to a draft.',
      'The action can be fully undone, but undoing it takes deliberate work such as restoring a backup, reverting several changes, or reissuing a request.',
      'The action can be mostly undone, but some effects persist afterward, such as notifications already delivered, quota consumed, or records others have already seen.',
      'The action cannot realistically be undone, though its effects stay within the system, such as overwriting data with no backup or discarding history.',
      'The action cannot be undone and its effect has already reached the outside world, such as a sent message, a completed payment, a permanent deletion, or a public publication.',
    ],
    options,
  );
  return actionReversibilityResultSchema.parse({
    ...decision,
    reversibility: actionReversibilityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  actionReversibilityInputSchema,
  actionReversibilityResultSchema,
  actionReversibilityVerdictSchema,
} from './schema.js';
export type {
  ActionReversibilityInput,
  ActionReversibilityResult,
  ActionReversibilityVerdict,
} from './schema.js';
