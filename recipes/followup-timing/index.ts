import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { followupTimingInputSchema, followupTimingResultSchema } from './schema.js';
import type { FollowupTimingInput, FollowupTimingResult } from './schema.js';

export async function followupTiming(
  input: FollowupTimingInput,
  options: RecipeOptions = {},
): Promise<FollowupTimingResult> {
  const { minConfidence = 0.8, ...state } = followupTimingInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "When does the current sender request or agree to another contact in message, given context? Resolve short replies using the preceding exchange. Distinguish a requested follow-up from a statement of availability that does not request one. Judge the current sender's words rather than quoted text. Use the latest clear correction. If incompatible conditions remain unresolved, choose unclear. Do not calculate a date or infer permission to contact.",
    {
      now: 'Another contact is requested or agreed to immediately or as soon as possible, with no future time or event condition.',
      later:
        'Another contact is requested or agreed to at a later time, date, or interval, including a vague but explicit delay. The timing does not depend on a non-calendar event.',
      after_event:
        'Another contact is requested or agreed to only after a stated non-calendar event, such as approval, delivery, or completion. This includes an event with an additional time bound.',
      not_requested:
        'The sender neither requests nor agrees to another contact and does not explicitly decline follow-up. Merely being busy or acknowledging information is not a request.',
      declined:
        'The sender explicitly declines another contact, with no accepted alternative time or condition.',
      unclear:
        'Whether or when follow-up is wanted cannot be resolved from the supplied message and context.',
    },
    options,
  );
  return followupTimingResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  followupTimingInputSchema,
  followupTimingResultSchema,
  followupTimingVerdictSchema,
} from './schema.js';
export type { FollowupTimingInput, FollowupTimingResult, FollowupTimingVerdict } from './schema.js';
