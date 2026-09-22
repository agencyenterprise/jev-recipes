import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { turnIntentInputSchema, turnIntentResultSchema } from './schema.js';
import type { TurnIntentInput, TurnIntentResult } from './schema.js';

export async function turnIntent(
  input: TurnIntentInput,
  options: RecipeOptions = {},
): Promise<TurnIntentResult> {
  const { minConfidence = 0.8, ...state } = turnIntentInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What is the primary communicative purpose of message in context? For mixed messages choose the purpose that changes what the application should do next; choose unclear if none dominates.',
    {
      request: 'The message asks for new work or information.',
      answer: 'The message supplies information requested earlier.',
      correction: 'The message corrects a prior fact or instruction.',
      cancellation: 'The message asks to stop or pause an existing task.',
      acknowledgment: 'The message acknowledges prior content without requesting substantive work.',
      other: 'The purpose is clear but does not fit the listed purposes.',
      unclear: 'The primary purpose cannot be established.',
    },
    options,
  );
  return turnIntentResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  turnIntentInputSchema,
  turnIntentResultSchema,
  turnIntentVerdictSchema,
} from './schema.js';
export type { TurnIntentInput, TurnIntentResult, TurnIntentVerdict } from './schema.js';
