import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { draftCompareInputSchema, draftCompareResultSchema } from './schema.js';
import type { DraftCompareInput, DraftCompareResult } from './schema.js';

export async function draftCompare(
  input: DraftCompareInput,
  options: RecipeOptions = {},
): Promise<DraftCompareResult> {
  const { minConfidence = 0.8, ...state } = draftCompareInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Which draft better satisfies request under rubric? Evaluate only the supplied criteria. Treat presentation order as irrelevant and allow a tie or neither.',
    {
      first: 'Only the first draft is suitable, or it clearly better satisfies the rubric.',
      second: 'Only the second draft is suitable, or it clearly better satisfies the rubric.',
      tie: 'Both drafts are suitable and neither is meaningfully better under the rubric.',
      neither: 'Neither draft satisfies the request and rubric.',
      unclear: 'There is insufficient information to make the comparison.',
    },
    options,
  );
  return draftCompareResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  draftCompareInputSchema,
  draftCompareResultSchema,
  draftCompareVerdictSchema,
} from './schema.js';
export type { DraftCompareInput, DraftCompareResult, DraftCompareVerdict } from './schema.js';
