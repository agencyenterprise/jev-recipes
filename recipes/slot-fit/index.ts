import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { slotFitInputSchema, slotFitResultSchema } from './schema.js';
import type { SlotFitInput, SlotFitResult } from './schema.js';

export async function slotFit(
  input: SlotFitInput,
  options: RecipeOptions = {},
): Promise<SlotFitResult> {
  const { minConfidence = 0.8, ...state } = slotFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does the time or slot proposed in proposal satisfy every availability constraint written in constraints? Read the constraints as a person would, including day-of-week rules, time-of-day windows, exclusions, and stated exceptions. Count the proposal as fitting only when it falls inside every stated window and outside every stated exclusion. Do not assume a time zone or a date that neither text supplies.',
    {
      true: 'The proposed slot satisfies all of the stated availability constraints.',
      false: 'The proposed slot falls outside at least one stated constraint.',
    },
    options,
  );
  return slotFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'fits' : 'violates',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export { slotFitInputSchema, slotFitResultSchema, slotFitVerdictSchema } from './schema.js';
export type { SlotFitInput, SlotFitResult, SlotFitVerdict } from './schema.js';
