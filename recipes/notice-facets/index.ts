import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { noticeFacetsInputSchema, noticeFacetsResultSchema } from './schema.js';
import type { NoticeFacetsInput, NoticeFacetsResult } from './schema.js';

export async function noticeFacets(
  input: NoticeFacetsInput,
  options: RecipeOptions = {},
): Promise<NoticeFacetsResult> {
  const { minConfidence = 0.8, ...state } = noticeFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesAction: {
        instruction:
          'Does notice tell the recipient something they must or should do, such as submit documents, pay, respond, or attend?',
        criteria: {
          true: 'The text names a specific action the recipient is asked or required to take.',
          false: 'The text informs the recipient of something without asking them to do anything.',
        },
      },
      statesDeadline: {
        instruction: 'Does notice state a date or time period by which the recipient must act?',
        criteria: {
          true: 'The text gives a date, or a number of days from a stated event, by which something must happen.',
          false: 'The text sets no date or period for the recipient to act.',
        },
      },
      statesConsequence: {
        instruction: 'Does notice state what will happen if the recipient does not act?',
        criteria: {
          true: 'The text describes an outcome that follows from not acting, such as denial, termination, a penalty, or a default decision.',
          false: 'The text does not say what happens if the recipient does nothing.',
        },
      },
      statesContact: {
        instruction:
          'Does notice give a way to reach someone with questions, such as a phone number, email address, office, or case worker?',
        criteria: {
          true: 'The text gives a phone number, email address, office location, web portal, or named person to contact.',
          false: 'The text gives no way to reach anyone with questions.',
        },
      },
      statesAppealRight: {
        instruction:
          'Does notice tell the recipient they may appeal, request a hearing, or otherwise contest the decision?',
        criteria: {
          true: 'The text mentions a right to appeal, request a hearing, request reconsideration, or otherwise contest the decision, with or without instructions.',
          false: 'The text does not mention any way to contest the decision.',
        },
      },
    },
    options,
  );
  return noticeFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  noticeFacetsInputSchema,
  noticeFacetsResultSchema,
  noticeFacetsLabelSchema,
} from './schema.js';
export type { NoticeFacetsInput, NoticeFacetsResult, NoticeFacetsLabel } from './schema.js';
