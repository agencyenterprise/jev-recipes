import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { appointmentRequestKindInputSchema, appointmentRequestKindResultSchema } from './schema.js';
import type { AppointmentRequestKindInput, AppointmentRequestKindResult } from './schema.js';

export async function appointmentRequestKind(
  input: AppointmentRequestKindInput,
  options: RecipeOptions = {},
): Promise<AppointmentRequestKindResult> {
  const { minConfidence = 0.8, ...state } = appointmentRequestKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What does the patient primarily want from message? Choose the single main request: booking a new appointment, moving an existing one, cancelling one, getting test results, refilling a prescription, or asking a question that needs an answer rather than one of those actions. Judge the stated request, not what the patient might additionally need. When two requests carry equal weight or the wording does not say what is wanted, answer unclear.',
    {
      schedule: 'The patient asks to book a new appointment.',
      reschedule: 'The patient asks to move an existing appointment to a different time.',
      cancel: 'The patient asks to cancel an existing appointment without booking another.',
      results: 'The patient asks for test or lab results or an explanation of them.',
      refill: 'The patient asks for a prescription to be refilled or renewed.',
      question:
        'The patient asks a question that needs an answer rather than an appointment, result, or refill action.',
      unclear: 'The message names no clear request, or names several requests of equal weight.',
    },
    options,
  );
  return appointmentRequestKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  appointmentRequestKindInputSchema,
  appointmentRequestKindResultSchema,
  appointmentRequestKindVerdictSchema,
} from './schema.js';
export type {
  AppointmentRequestKindInput,
  AppointmentRequestKindResult,
  AppointmentRequestKindVerdict,
} from './schema.js';
