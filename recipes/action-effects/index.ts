import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { actionEffectsInputSchema, actionEffectsResultSchema } from './schema.js';
import type { ActionEffectsInput, ActionEffectsResult } from './schema.js';

export async function actionEffects(
  input: ActionEffectsInput,
  options: RecipeOptions = {},
): Promise<ActionEffectsResult> {
  const { minConfidence = 0.8, ...state } = actionEffectsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      writesData: {
        instruction:
          'Does action create or modify stored data, such as records, files, settings, or state, without merely deleting it?',
        criteria: {
          true: 'The action creates, updates, or overwrites stored records, files, fields, or configuration.',
          false: 'The action only reads, computes, sends, deletes, or does nothing to stored data.',
        },
      },
      sendsMessage: {
        instruction:
          'Does action send a message or notification to a person or channel, such as an email, chat message, SMS, push notification, or post?',
        criteria: {
          true: 'The action transmits a message or notification that a person or channel will receive.',
          false: 'The action sends nothing that a person or channel would receive as a message.',
        },
      },
      spendsMoney: {
        instruction:
          'Does action spend, transfer, refund, or otherwise move money or paid credits?',
        criteria: {
          true: 'The action makes a purchase, payment, transfer, refund, or charge, or consumes paid credits the description names.',
          false:
            'The action moves no money and consumes no paid credits that the description names.',
        },
      },
      deletesData: {
        instruction:
          'Does action delete, remove, drop, or purge stored data, records, files, or resources?',
        criteria: {
          true: 'The action removes stored data, records, files, or resources so they no longer exist in their current location.',
          false:
            'The action removes nothing; archiving or marking as inactive without removal does not count.',
        },
      },
      callsExternal: {
        instruction:
          "Does action call a service outside the system running the agent, such as a third-party API, a web request, or another vendor's platform?",
        criteria: {
          true: "The action contacts a third-party API, external web endpoint, or another organization's service.",
          false:
            "The action stays within the system's own data and code with no outbound call to an external service.",
        },
      },
    },
    options,
  );
  return actionEffectsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  actionEffectsInputSchema,
  actionEffectsResultSchema,
  actionEffectsLabelSchema,
} from './schema.js';
export type { ActionEffectsInput, ActionEffectsResult, ActionEffectsLabel } from './schema.js';
