import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { actionScopeInputSchema, actionScopeResultSchema } from './schema.js';
import type { ActionScopeInput, ActionScopeResult } from './schema.js';

export async function actionScope(
  input: ActionScopeInput,
  options: RecipeOptions = {},
): Promise<ActionScopeResult> {
  const { minConfidence = 0.8, ...state } = actionScopeInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Is proposedAction within the work requested in request and constraints? Do not treat a potentially helpful extra task as requested work. An explicit constraint overrides an implied convenience.',
    {
      within_scope:
        'The action is explicitly requested or directly necessary under the stated constraints.',
      additional_work:
        'The action introduces unrequested work, changes the requested outcome, or violates a stated scope constraint.',
      unclear: 'The scope relationship cannot be established from the request.',
    },
    options,
  );
  return actionScopeResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  actionScopeInputSchema,
  actionScopeResultSchema,
  actionScopeVerdictSchema,
} from './schema.js';
export type { ActionScopeInput, ActionScopeResult, ActionScopeVerdict } from './schema.js';
