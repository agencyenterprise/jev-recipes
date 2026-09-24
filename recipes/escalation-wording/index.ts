import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { escalationWordingInputSchema, escalationWordingResultSchema } from './schema.js';
import type { EscalationWordingInput, EscalationWordingResult } from './schema.js';

export async function escalationWording(
  input: EscalationWordingInput,
  options: RecipeOptions = {},
): Promise<EscalationWordingResult> {
  const { minConfidence = 0.8, ...state } = escalationWordingInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does message explicitly ask for escalation to a higher tier, a manager or supervisor, or on-call engineering? Answer yes only when the text asks to involve someone more senior, more specialised, or on a different team than the current handler. Ignore tone, urgency, and complaints about past service unless they contain such a request.',
    {
      true: 'The message asks to involve a manager, supervisor, higher support tier, engineering, or on-call staff, or asks that the issue be escalated.',
      false:
        'The message makes no such request, even if it is urgent, frustrated, or describes a serious problem.',
    },
    options,
  );
  return escalationWordingResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'requested' : 'absent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  escalationWordingInputSchema,
  escalationWordingResultSchema,
  escalationWordingVerdictSchema,
} from './schema.js';
export type {
  EscalationWordingInput,
  EscalationWordingResult,
  EscalationWordingVerdict,
} from './schema.js';
