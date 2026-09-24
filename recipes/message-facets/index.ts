import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { messageFacetsInputSchema, messageFacetsResultSchema } from './schema.js';
import type { MessageFacetsInput, MessageFacetsResult } from './schema.js';

export async function messageFacets(
  input: MessageFacetsInput,
  options: RecipeOptions = {},
): Promise<MessageFacetsResult> {
  const { minConfidence = 0.8, ...state } = messageFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      asksQuestion: {
        instruction: 'Does message ask a question that expects an answer, given any context?',
        criteria: {
          true: 'The message asks at least one question expecting an answer.',
          false: 'The message asks no question, or only rhetorical ones.',
        },
      },
      reportsProblem: {
        instruction:
          'Does message report something that is broken, wrong, or not working as expected?',
        criteria: {
          true: 'The message reports a problem the sender is experiencing.',
          false: 'The message reports no problem.',
        },
      },
      requestsAction: {
        instruction: 'Does message ask the recipient to do something specific?',
        criteria: {
          true: 'The message requests a concrete action from the recipient.',
          false: 'The message requests no action.',
        },
      },
      statesDeadline: {
        instruction: 'Does message state a deadline, date, or time by which something must happen?',
        criteria: {
          true: 'The message states an explicit deadline or time constraint.',
          false: 'The message states no deadline.',
        },
      },
      referencesPriorContact: {
        instruction:
          'Does message refer to an earlier conversation, ticket, call, or email about the same matter?',
        criteria: {
          true: 'The message refers to prior contact about this matter.',
          false: 'The message does not refer to prior contact.',
        },
      },
    },
    options,
  );
  return messageFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  messageFacetsInputSchema,
  messageFacetsResultSchema,
  messageFacetsLabelSchema,
} from './schema.js';
export type { MessageFacetsInput, MessageFacetsResult, MessageFacetsLabel } from './schema.js';
