import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { instrumentReportFacetsInputSchema, instrumentReportFacetsResultSchema } from './schema.js';
import type { InstrumentReportFacetsInput, InstrumentReportFacetsResult } from './schema.js';

export async function instrumentReportFacets(
  input: InstrumentReportFacetsInput,
  options: RecipeOptions = {},
): Promise<InstrumentReportFacetsResult> {
  const { minConfidence = 0.8, ...state } = instrumentReportFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesInstrument: {
        instruction:
          'Does message identify the specific instrument or device, such as a make and model, a serial number, or an equally specific description beyond the generic type?',
        criteria: {
          true: 'The message names the make, model, or serial of the instrument or device, or describes it specifically enough to identify the exact product.',
          false:
            'The message names only a generic type such as my guitar, the keyboard, or my trumpet, or does not say what instrument is involved.',
        },
      },
      statesSymptom: {
        instruction:
          'Does message describe what is wrong, such as a buzz, a stuck key, tuning drift, no output, or a crack, rather than saying only that something is broken or not working?',
        criteria: {
          true: 'The message describes the specific symptom the player observes, including where or when it happens if that is part of the description.',
          false:
            'The message says only that the instrument is broken, not working, or needs a look, without describing the symptom.',
        },
      },
      statesOnset: {
        instruction: 'Does message say when the problem started or how long it has been happening?',
        criteria: {
          true: 'The message gives a time, date, or duration for when the problem began or how long it has persisted.',
          false:
            'The message does not say when the problem began or how long it has been going on.',
        },
      },
      statesRecentChanges: {
        instruction:
          'Does message mention something that changed shortly before the problem, such as new strings, a setup, a move, a drop, a firmware or software update, new cables, or a different amplifier?',
        criteria: {
          true: 'The message names a recent event or change to the instrument, its setup, or its accessories that preceded the problem, or states explicitly that nothing has changed.',
          false:
            'The message says nothing about recent changes, events, or handling before the problem appeared.',
        },
      },
      statesEnvironment: {
        instruction:
          'Does message describe the conditions the instrument is kept or used in, such as humidity, temperature, seasonal change, storage in a case or on a stand, or transport?',
        criteria: {
          true: 'The message gives environmental or storage conditions such as humidity or temperature readings, a dry or damp room, heating season, a hot car, or how the instrument is stored.',
          false:
            'The message says nothing about humidity, temperature, storage, or the surroundings the instrument is kept in.',
        },
      },
    },
    options,
  );
  return instrumentReportFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  instrumentReportFacetsInputSchema,
  instrumentReportFacetsResultSchema,
  instrumentReportFacetsLabelSchema,
} from './schema.js';
export type {
  InstrumentReportFacetsInput,
  InstrumentReportFacetsResult,
  InstrumentReportFacetsLabel,
} from './schema.js';
