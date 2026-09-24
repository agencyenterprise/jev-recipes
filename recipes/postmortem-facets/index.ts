import { evaluateLabels, resolveLabels } from '../../src/labels.js';
import type { RecipeOptions } from '../../src/schema.js';
import { postmortemFacetsInputSchema, postmortemFacetsResultSchema } from './schema.js';
import type { PostmortemFacetsInput, PostmortemFacetsResult } from './schema.js';

export async function postmortemFacets(
  input: PostmortemFacetsInput,
  options: RecipeOptions = {},
): Promise<PostmortemFacetsResult> {
  const { minConfidence = 0.8, ...state } = postmortemFacetsInputSchema.parse(input);
  const evaluation = await evaluateLabels(
    state,
    {
      statesTimeline: {
        instruction:
          'Does postmortem give a sequence of events with times or clear ordering, from detection through resolution?',
        criteria: {
          true: 'The postmortem lays out ordered events with timestamps or an explicit sequence covering at least detection and resolution.',
          false:
            'The postmortem gives no ordered sequence of events, or mentions only a single point in time.',
        },
      },
      statesRootCause: {
        instruction:
          'Does postmortem state a specific underlying cause of the incident, beyond restating the symptom?',
        criteria: {
          true: 'The postmortem names a specific cause that explains why the failure happened, such as a code change, configuration, or capacity limit.',
          false:
            'The postmortem restates the symptom, says the cause is unknown, or omits a cause entirely.',
        },
      },
      statesImpact: {
        instruction:
          'Does postmortem describe the effect on customers or users, such as who was affected, what failed for them, and for how long?',
        criteria: {
          true: 'The postmortem describes user-facing impact with at least one of affected population, affected functionality, or duration.',
          false:
            'The postmortem describes only internal effects or does not describe impact at all.',
        },
      },
      statesContributingFactors: {
        instruction:
          'Does postmortem name additional conditions that made the incident worse or more likely, distinct from the root cause, such as missing alerts, gaps in testing, or slow escalation?',
        criteria: {
          true: 'The postmortem lists at least one contributing condition separate from the primary cause.',
          false:
            'The postmortem gives only the primary cause with no separate contributing conditions.',
        },
      },
      statesActionItems: {
        instruction:
          'Does postmortem list concrete follow-up actions intended to prevent recurrence or reduce impact?',
        criteria: {
          true: 'The postmortem lists at least one specific follow-up task, with or without an owner or date.',
          false: 'The postmortem lists no follow-up tasks, or only says that lessons were learned.',
        },
      },
    },
    options,
  );
  return postmortemFacetsResultSchema.parse({
    ...resolveLabels(evaluation.labels, minConfidence),
    model: evaluation.model,
    usage: evaluation.usage,
  });
}

export {
  postmortemFacetsInputSchema,
  postmortemFacetsResultSchema,
  postmortemFacetsLabelSchema,
} from './schema.js';
export type {
  PostmortemFacetsInput,
  PostmortemFacetsResult,
  PostmortemFacetsLabel,
} from './schema.js';
