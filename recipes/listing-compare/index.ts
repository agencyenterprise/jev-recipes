import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { listingCompareInputSchema, listingCompareResultSchema } from './schema.js';
import type { ListingCompareInput, ListingCompareResult } from './schema.js';

export async function listingCompare(
  input: ListingCompareInput,
  options: RecipeOptions = {},
): Promise<ListingCompareResult> {
  const { minConfidence = 0.8, ...state } = listingCompareInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    'Which listing better satisfies what request asks for? Weigh stated must-have attributes first, then stated preferences. Judge the product each listing describes, not the length or polish of the listing text.',
    {
      first:
        'Only the first listing satisfies the request, or it clearly satisfies more of what the request asks for.',
      second:
        'Only the second listing satisfies the request, or it clearly satisfies more of what the request asks for.',
      tie: 'Both listings satisfy the request about equally well.',
      neither: 'Neither listing describes a product that satisfies the request.',
    },
    options,
  );
  return listingCompareResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  listingCompareInputSchema,
  listingCompareResultSchema,
  listingCompareVerdictSchema,
} from './schema.js';
export type { ListingCompareInput, ListingCompareResult, ListingCompareVerdict } from './schema.js';
