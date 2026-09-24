import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { claimFacetsInputSchema, claimFacetsResultSchema } from './schema.js';
import type { ClaimFacetsInput, ClaimFacetsResult } from './schema.js';

export async function claimFacets(
  input: ClaimFacetsInput,
  options: RecipeOptions = {},
): Promise<ClaimFacetsResult> {
  const { minConfidence = 0.8, ...state } = claimFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesWhen: {
        instruction:
          'Does claim state when the incident happened, as a date, a day, a time, or a clearly anchored period such as "overnight on Tuesday"?',
        criteria: {
          true: 'The narrative names a date, day, time, or anchored period for the incident.',
          false: 'The narrative gives no indication of when the incident occurred.',
        },
      },
      statesWhere: {
        instruction:
          'Does claim state where the incident happened, such as an address, a room or part of a property, a road or intersection, or a named place?',
        criteria: {
          true: 'The narrative names the location where the incident occurred.',
          false: 'The narrative does not say where the incident took place.',
        },
      },
      statesCause: {
        instruction:
          'Does claim state what caused the loss, such as a storm, a burst pipe, a break-in, a collision, or a fire, rather than only describing the resulting damage?',
        criteria: {
          true: 'The narrative identifies the event or mechanism that caused the loss.',
          false: 'The narrative describes damage or loss without saying what caused it.',
        },
      },
      statesDamages: {
        instruction:
          'Does claim state what was damaged, destroyed, lost, or injured, whether as specific items, parts of a property, or a described extent of harm?',
        criteria: {
          true: 'The narrative names the property, items, or harm affected by the incident.',
          false: 'The narrative does not say what was damaged or lost.',
        },
      },
      statesEvidence: {
        instruction:
          'Does claim mention witnesses, photographs, video, receipts, a police or incident report, or other evidence supporting the account?',
        criteria: {
          true: 'The narrative refers to at least one witness or piece of supporting evidence.',
          false: 'The narrative mentions no witnesses or supporting evidence.',
        },
      },
    },
    options,
  );
  return claimFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  claimFacetsInputSchema,
  claimFacetsResultSchema,
  claimFacetsLabelSchema,
} from './schema.js';
export type { ClaimFacetsInput, ClaimFacetsResult, ClaimFacetsLabel } from './schema.js';
