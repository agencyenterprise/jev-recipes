import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { privacyNoticeFacetsInputSchema, privacyNoticeFacetsResultSchema } from './schema.js';
import type { PrivacyNoticeFacetsInput, PrivacyNoticeFacetsResult } from './schema.js';

export async function privacyNoticeFacets(
  input: PrivacyNoticeFacetsInput,
  options: RecipeOptions = {},
): Promise<PrivacyNoticeFacetsResult> {
  const { minConfidence = 0.8, ...state } = privacyNoticeFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesDataCollected: {
        instruction: 'Does notice state what personal data is collected from or about the reader?',
        criteria: {
          true: 'The notice names the categories or items of personal data that are collected.',
          false: 'The notice does not say what personal data is collected.',
        },
      },
      statesPurpose: {
        instruction: 'Does notice state why the collected data is used?',
        criteria: {
          true: 'The notice states at least one purpose for which the data is used.',
          false: 'The notice does not say why the data is used.',
        },
      },
      statesRetention: {
        instruction: 'Does notice state how long the collected data is kept?',
        criteria: {
          true: 'The notice states a retention period or the criteria that determine it.',
          false: 'The notice does not say how long the data is kept.',
        },
      },
      statesSharing: {
        instruction:
          'Does notice state who the collected data is shared with, or that it is not shared?',
        criteria: {
          true: 'The notice names the recipients or categories of recipients, or states that data is not shared.',
          false: 'The notice does not address who receives the data.',
        },
      },
      statesContact: {
        instruction:
          'Does notice state how to contact the organization or controller responsible for the data?',
        criteria: {
          true: 'The notice gives a contact method such as an email address, postal address, form, or phone number.',
          false: 'The notice gives no way to contact the responsible party.',
        },
      },
    },
    options,
  );
  return privacyNoticeFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  privacyNoticeFacetsInputSchema,
  privacyNoticeFacetsResultSchema,
  privacyNoticeFacetsLabelSchema,
} from './schema.js';
export type {
  PrivacyNoticeFacetsInput,
  PrivacyNoticeFacetsResult,
  PrivacyNoticeFacetsLabel,
} from './schema.js';
