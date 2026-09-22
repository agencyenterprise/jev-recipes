import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { urgencySignalInputSchema, urgencySignalResultSchema } from './schema.js';
import type { UrgencySignalInput, UrgencySignalResult } from './schema.js';

export async function urgencySignal(
  input: UrgencySignalInput,
  options: RecipeOptions = {},
): Promise<UrgencySignalResult> {
  const { minConfidence = 0.8, ...state } = urgencySignalInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does message explicitly request urgent attention? Look for stated urgency, not inferred importance, customer tone, or an unstated interpretation of a date.',
    {
      expressed: 'The message explicitly asks for immediate, urgent, or expedited attention.',
      not_expressed: 'The message does not explicitly ask for urgent attention.',
      unclear: 'The urgency language is too ambiguous to interpret.',
    },
    options,
  );
  return urgencySignalResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  urgencySignalInputSchema,
  urgencySignalResultSchema,
  urgencySignalVerdictSchema,
} from './schema.js';
export type { UrgencySignalInput, UrgencySignalResult, UrgencySignalVerdict } from './schema.js';
