import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { repeatedAttemptInputSchema, repeatedAttemptResultSchema } from './schema.js';
import type { RepeatedAttemptInput, RepeatedAttemptResult } from './schema.js';

export async function repeatedAttempt(
  input: RepeatedAttemptInput,
  options: RecipeOptions = {},
): Promise<RepeatedAttemptResult> {
  const { minConfidence = 0.8, ...state } = repeatedAttemptInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does proposedAttempt use essentially the same approach as previousAttempt for objective? Rewording the same query without a material strategy change counts as the same approach.',
    {
      same_approach: 'The proposed attempt repeats the material method and relevant assumptions.',
      different_approach: 'The proposed attempt changes a material method, source, or assumption.',
      unclear: 'The attempts are not described precisely enough to compare.',
    },
    options,
  );
  return repeatedAttemptResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  repeatedAttemptInputSchema,
  repeatedAttemptResultSchema,
  repeatedAttemptVerdictSchema,
} from './schema.js';
export type {
  RepeatedAttemptInput,
  RepeatedAttemptResult,
  RepeatedAttemptVerdict,
} from './schema.js';
