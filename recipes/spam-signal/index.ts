import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { spamSignalInputSchema, spamSignalResultSchema } from './schema.js';
import type { SpamSignalInput, SpamSignalResult } from './schema.js';

export async function spamSignal(
  input: SpamSignalInput,
  options: RecipeOptions = {},
): Promise<SpamSignalResult> {
  const { minConfidence = 0.8, ...state } = spamSignalInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Is message unsolicited promotional, scam, or bulk content rather than a genuine contribution to the conversation or community, given any context? Count unsolicited advertising, affiliate or referral pushes, phishing and fraud lures, and templated mass postings. Do not count on-topic recommendations, replies to a request for suggestions, or self-promotion that the context permits.',
    {
      true: 'The message is unsolicited promotional, scam, or bulk content.',
      false: 'The message is a genuine contribution to the conversation or community.',
    },
    options,
  );
  return spamSignalResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'spam' : 'genuine',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  spamSignalInputSchema,
  spamSignalResultSchema,
  spamSignalVerdictSchema,
} from './schema.js';
export type { SpamSignalInput, SpamSignalResult, SpamSignalVerdict } from './schema.js';
