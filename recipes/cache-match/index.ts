import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { cacheMatchInputSchema, cacheMatchResultSchema } from './schema.js';
import type { CacheMatchInput, CacheMatchResult } from './schema.js';

export async function cacheMatch(
  input: CacheMatchInput,
  options: RecipeOptions = {},
): Promise<CacheMatchResult> {
  const { minConfidence = 0.8, ...state } = cacheMatchInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does cachedAnswer address question with the same relevant meaning and conditions as originalQuestion? Do not assume freshness, access, tenant, or product compatibility beyond the supplied facts.',
    {
      reusable:
        'The cached answer addresses the new question without a material mismatch in meaning or stated conditions.',
      unsuitable:
        'The cached answer leaves a material part unanswered or applies to a different stated condition.',
      unclear: 'Missing or ambiguous conditions prevent establishing a match.',
    },
    options,
  );
  return cacheMatchResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  cacheMatchInputSchema,
  cacheMatchResultSchema,
  cacheMatchVerdictSchema,
} from './schema.js';
export type { CacheMatchInput, CacheMatchResult, CacheMatchVerdict } from './schema.js';
