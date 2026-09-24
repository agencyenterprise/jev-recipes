import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { intakeQuestionFitInputSchema, intakeQuestionFitResultSchema } from './schema.js';
import type { IntakeQuestionFitInput, IntakeQuestionFitResult } from './schema.js';

export async function intakeQuestionFit(
  input: IntakeQuestionFitInput,
  options: RecipeOptions = {},
): Promise<IntakeQuestionFitResult> {
  const { minConfidence = 0.8, ...state } = intakeQuestionFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does question ask only for information that purpose needs? Consider each thing the question asks for and whether it plausibly serves the stated purpose. The question overreaches when it asks for personal detail, history, or identifiers that purpose does not call for, even if that detail might be useful for something else. Do not judge tone, wording quality, or whether collecting the information is legally permitted.',
    {
      true: 'Everything the question asks for serves the stated purpose.',
      false: 'The question asks for at least one detail that the stated purpose does not need.',
    },
    options,
  );
  return intakeQuestionFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'fits' : 'overreaches',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  intakeQuestionFitInputSchema,
  intakeQuestionFitResultSchema,
  intakeQuestionFitVerdictSchema,
} from './schema.js';
export type {
  IntakeQuestionFitInput,
  IntakeQuestionFitResult,
  IntakeQuestionFitVerdict,
} from './schema.js';
