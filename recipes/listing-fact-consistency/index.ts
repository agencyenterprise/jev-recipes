import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { listingFactConsistencyInputSchema, listingFactConsistencyResultSchema } from './schema.js';
import type { ListingFactConsistencyInput, ListingFactConsistencyResult } from './schema.js';

export async function listingFactConsistency(
  input: ListingFactConsistencyInput,
  options: RecipeOptions = {},
): Promise<ListingFactConsistencyResult> {
  const { minConfidence = 0.8, ...state } = listingFactConsistencyInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Compare the description with the facts sheet and decide whether description states anything that contradicts a value or feature given in facts, such as a different bedroom count, a different size, a different year built, or a feature that facts says is absent. Judge contradiction only: description may omit facts, add detail not in facts, or use marketing language without contradicting anything. Ignore tone, typos, and whether either input is plausible on its own.',
    {
      true: 'The description states at least one value or feature that conflicts with what facts gives for the same attribute, beyond ordinary rounding or synonyms.',
      false:
        'Every value or feature the description states either matches facts or concerns an attribute facts does not cover.',
    },
    options,
  );
  return listingFactConsistencyResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'contradicts' : 'consistent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  listingFactConsistencyInputSchema,
  listingFactConsistencyResultSchema,
  listingFactConsistencyVerdictSchema,
} from './schema.js';
export type {
  ListingFactConsistencyInput,
  ListingFactConsistencyResult,
  ListingFactConsistencyVerdict,
} from './schema.js';
