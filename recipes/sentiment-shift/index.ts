import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { sentimentShiftInputSchema, sentimentShiftResultSchema } from './schema.js';
import type { SentimentShiftInput, SentimentShiftResult } from './schema.js';

export async function sentimentShift(
  input: SentimentShiftInput,
  options: RecipeOptions = {},
): Promise<SentimentShiftResult> {
  const { minConfidence = 0.8, ...state } = sentimentShiftInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    "How does the sentiment expressed in laterMessage compare with the sentiment expressed in earlierMessage, both written by the same person? Judge the expressed wording of each message, not the topic, the outcome, or the person's inner state.",
    {
      improved:
        'The wording of laterMessage expresses a clearly more positive sentiment than earlierMessage.',
      unchanged:
        'The wording of laterMessage expresses about the same sentiment as earlierMessage, whether positive, negative, or neutral.',
      worsened:
        'The wording of laterMessage expresses a clearly more negative sentiment than earlierMessage.',
      unclear: 'The supplied messages do not establish a clear comparison of expressed sentiment.',
    },
    options,
  );
  return sentimentShiftResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  sentimentShiftInputSchema,
  sentimentShiftResultSchema,
  sentimentShiftVerdictSchema,
} from './schema.js';
export type { SentimentShiftInput, SentimentShiftResult, SentimentShiftVerdict } from './schema.js';
