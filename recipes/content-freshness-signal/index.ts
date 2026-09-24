import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { contentFreshnessSignalInputSchema, contentFreshnessSignalResultSchema } from './schema.js';
import type { ContentFreshnessSignalInput, ContentFreshnessSignalResult } from './schema.js';

export async function contentFreshnessSignal(
  input: ContentFreshnessSignalInput,
  options: RecipeOptions = {},
): Promise<ContentFreshnessSignalResult> {
  const { minConfidence = 0.8, ...state } = contentFreshnessSignalInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does content contain claims likely to go stale? Look for specific prices, version numbers, release dates, statistics tied to a year, references to current events or ongoing situations, and wording such as latest, new, currently, this year, or upcoming. Treat content as perishable when at least one such claim is central or repeated. Treat it as evergreen when its claims are definitions, principles, historical facts, or procedures that do not depend on the present moment. Ignore the publication date itself if it appears only as a byline.',
    {
      true: 'The content includes at least one substantive claim tied to the present, such as a price, version number, current statistic, ongoing event, or latest or currently wording.',
      false:
        'The content consists of definitions, principles, historical facts, or procedures that do not depend on the present moment and contains no time-bound claim.',
    },
    options,
  );
  return contentFreshnessSignalResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'perishable' : 'evergreen',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  contentFreshnessSignalInputSchema,
  contentFreshnessSignalResultSchema,
  contentFreshnessSignalVerdictSchema,
} from './schema.js';
export type {
  ContentFreshnessSignalInput,
  ContentFreshnessSignalResult,
  ContentFreshnessSignalVerdict,
} from './schema.js';
