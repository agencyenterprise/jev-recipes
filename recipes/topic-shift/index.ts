import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { topicShiftInputSchema, topicShiftResultSchema } from './schema.js';
import type { TopicShiftInput, TopicShiftResult } from './schema.js';

export async function topicShift(
  input: TopicShiftInput,
  options: RecipeOptions = {},
): Promise<TopicShiftResult> {
  const { minConfidence = 0.8, ...state } = topicShiftInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does message stay with currentTopic, introduce a different topic, or contain both? A new detail within the same subject is not automatically a new topic.',
    {
      same_topic: 'The message remains within the current subject.',
      new_topic: 'The message moves to a different subject.',
      mixed: 'The message substantively addresses both the current and a new subject.',
      unclear: 'The subject relationship cannot be resolved.',
    },
    options,
  );
  return topicShiftResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  topicShiftInputSchema,
  topicShiftResultSchema,
  topicShiftVerdictSchema,
} from './schema.js';
export type { TopicShiftInput, TopicShiftResult, TopicShiftVerdict } from './schema.js';
