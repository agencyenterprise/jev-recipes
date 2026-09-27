import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { wakeGateInputSchema, wakeGateResultSchema } from './schema.js';
import type { WakeGateInput, WakeGateResult } from './schema.js';

export async function wakeGate(
  input: WakeGateInput,
  options: RecipeOptions = {},
): Promise<WakeGateResult> {
  const { minConfidence = 0.8, ...state } = wakeGateInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Should event wake an agent that paused until waitingFor happens? Choose wake when the event satisfies the wait condition, reports that it can no longer be satisfied, or changes the situation enough that the agent must reconsider. Choose not_yet when the event concerns the same matter but the condition is still pending, such as partial progress or a status update. Choose unrelated when the event has nothing to do with the wait condition, including routine noise. Use context, when supplied, for what the agent has already seen.',
    {
      wake: 'The event satisfies the wait condition, makes it unsatisfiable, or materially changes what the agent must do.',
      not_yet: 'The event is about the same matter, but the wait condition is still pending.',
      unrelated: 'The event has nothing to do with the wait condition.',
      unclear: 'The supplied facts do not establish how the event relates to the wait condition.',
    },
    options,
  );
  return wakeGateResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export { wakeGateInputSchema, wakeGateResultSchema, wakeGateVerdictSchema } from './schema.js';
export type { WakeGateInput, WakeGateResult, WakeGateVerdict } from './schema.js';
