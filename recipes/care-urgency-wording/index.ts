import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  careUrgencyWordingInputSchema,
  careUrgencyWordingResultSchema,
  careUrgencyWordingVerdictSchema,
} from './schema.js';
import type { CareUrgencyWordingInput, CareUrgencyWordingResult } from './schema.js';

export async function careUrgencyWording(
  input: CareUrgencyWordingInput,
  options: RecipeOptions = {},
): Promise<CareUrgencyWordingResult> {
  const { minConfidence = 0.8, ...state } = careUrgencyWordingInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    "How urgent is the care that message asks for, judged only by what the patient's wording requests or says about timing? Read stated timeframes, explicit urgency words, and any described inability to wait. Do not assess whether the described symptoms are medically serious, and do not raise or lower the level based on your own clinical view of the condition.",
    [
      'The message asks for care with no time pressure, such as a checkup, a routine follow-up, or a matter the patient says can wait for the next available slot.',
      'The message asks to be seen in the coming days or weeks, or says the matter is not urgent but should not be left indefinitely.',
      'The message asks to be seen within a day or two, or says the problem is worsening and the patient wants it looked at quickly.',
      'The message asks to be seen today or right away, says the patient cannot wait, or asks whether to go to urgent care.',
      'The message frames the situation as an emergency, or asks whether to call emergency services or go to the emergency room now.',
    ],
    options,
  );
  return careUrgencyWordingResultSchema.parse({
    ...decision,
    urgency: careUrgencyWordingVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  careUrgencyWordingInputSchema,
  careUrgencyWordingResultSchema,
  careUrgencyWordingVerdictSchema,
} from './schema.js';
export type {
  CareUrgencyWordingInput,
  CareUrgencyWordingResult,
  CareUrgencyWordingVerdict,
} from './schema.js';
