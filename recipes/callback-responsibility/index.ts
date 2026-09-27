import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { callbackResponsibilityInputSchema, callbackResponsibilityResultSchema } from './schema.js';
import type { CallbackResponsibilityInput, CallbackResponsibilityResult } from './schema.js';

export async function callbackResponsibility(
  input: CallbackResponsibilityInput,
  options: RecipeOptions = {},
): Promise<CallbackResponsibilityResult> {
  const { minConfidence = 0.8, ...state } = callbackResponsibilityInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Who is expected to place the next telephone call under the latest still-active arrangement in conversation? First identify the initiator from the words: "I will call you" means the speaker; "call me" or "a callback from you" means the person addressed. Then map that person to business or customer using only the supplied roles. Roles are authoritative even when the wording sounds more typical of the other role, such as mentioning store hours. Missing roles require unclear. Discard a commitment that a later exchange explicitly withdraws. If a future call is still contemplated but no initiator is settled, choose unclear; use none only when no future call remains contemplated. A direct request can establish responsibility without a separate acceptance. Conditional calls still have an initiator. Distinguish placing a call from answering one, sending an email, completing a task, and a call already completed.',
    {
      business:
        'The business is clearly requested, committed, or agreed to initiate the next call.',
      customer:
        'The customer is clearly requested, committed, or agreed to initiate the next call.',
      either:
        'The exchange explicitly establishes that either party may initiate the next call, with neither solely responsible.',
      none: 'No future callback is established or contemplated, or a previous callback arrangement has been clearly cancelled or completed without a new one.',
      unclear:
        'A callback is contemplated but its initiator, speaker roles, acceptance of a tentative suggestion, or competing commitments cannot be resolved.',
    },
    options,
  );
  return callbackResponsibilityResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  callbackResponsibilityInputSchema,
  callbackResponsibilityResultSchema,
  callbackResponsibilityVerdictSchema,
} from './schema.js';
export type {
  CallbackResponsibilityInput,
  CallbackResponsibilityResult,
  CallbackResponsibilityVerdict,
} from './schema.js';
