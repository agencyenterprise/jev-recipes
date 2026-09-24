import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { symptomFacetsInputSchema, symptomFacetsResultSchema } from './schema.js';
import type { SymptomFacetsInput, SymptomFacetsResult } from './schema.js';

export async function symptomFacets(
  input: SymptomFacetsInput,
  options: RecipeOptions = {},
): Promise<SymptomFacetsResult> {
  const { minConfidence = 0.8, ...state } = symptomFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesOnset: {
        instruction: 'Does message say when the symptom began or what it began after?',
        criteria: {
          true: 'The message names a time, date, or triggering event for when the symptom started.',
          false: 'The message gives no indication of when the symptom began.',
        },
      },
      statesSeverity: {
        instruction: 'Does message describe how bad the symptom is?',
        criteria: {
          true: 'The message gives a rating, an intensity word, or a concrete effect on daily activity that conveys how bad the symptom is.',
          false: 'The message gives no indication of how bad the symptom is.',
        },
      },
      statesDuration: {
        instruction: 'Does message say how long the symptom has lasted or how often it occurs?',
        criteria: {
          true: 'The message states an elapsed time or a frequency for the symptom.',
          false: 'The message states no elapsed time or frequency for the symptom.',
        },
      },
      statesModifiers: {
        instruction: 'Does message say what makes the symptom better or worse?',
        criteria: {
          true: 'The message names at least one activity, position, time of day, or remedy that changes the symptom.',
          false: 'The message names nothing that makes the symptom better or worse.',
        },
      },
      statesPriorTreatment: {
        instruction: 'Does message say what the patient has already tried for the symptom?',
        criteria: {
          true: 'The message names a medication, remedy, or action the patient has already taken for the symptom.',
          false: 'The message names nothing the patient has already tried.',
        },
      },
    },
    options,
  );
  return symptomFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  symptomFacetsInputSchema,
  symptomFacetsResultSchema,
  symptomFacetsLabelSchema,
} from './schema.js';
export type { SymptomFacetsInput, SymptomFacetsResult, SymptomFacetsLabel } from './schema.js';
