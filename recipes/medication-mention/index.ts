import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { medicationMentionInputSchema, medicationMentionResultSchema } from './schema.js';
import type { MedicationMentionInput, MedicationMentionResult } from './schema.js';

export async function medicationMention(
  input: MedicationMentionInput,
  options: RecipeOptions = {},
): Promise<MedicationMentionResult> {
  const { minConfidence = 0.8, ...state } = medicationMentionInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does message mention a medication, supplement, or dosage? Count brand or generic drug names, over-the-counter products, vitamins and herbal supplements, and any dose, strength, or dosing schedule. Do not count general words such as "treatment" or "prescription" with no product named, and do not count medical devices, procedures, or ordinary foods.',
    {
      true: 'The message names at least one medication, supplement, or a specific dose or dosing schedule.',
      false: 'The message names no medication, supplement, dose, or dosing schedule.',
    },
    options,
  );
  return medicationMentionResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'mentioned' : 'absent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  medicationMentionInputSchema,
  medicationMentionResultSchema,
  medicationMentionVerdictSchema,
} from './schema.js';
export type {
  MedicationMentionInput,
  MedicationMentionResult,
  MedicationMentionVerdict,
} from './schema.js';
