import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { querySpecificityInputSchema, querySpecificityResultSchema } from './schema.js';
import type { QuerySpecificityInput, QuerySpecificityResult } from './schema.js';

export async function querySpecificity(
  input: QuerySpecificityInput,
  options: RecipeOptions = {},
): Promise<QuerySpecificityResult> {
  const { minConfidence = 0.8, ...state } = querySpecificityInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does question, interpreted with context, identify a focused information need? A broad but clear request differs from an ambiguous reference or missing subject.',
    {
      specific: 'The subject and requested information are sufficiently clear and focused.',
      too_broad:
        'The intended subject is clear but the request spans an open-ended range of information.',
      ambiguous:
        'The subject, reference, or intended information has multiple unresolved meanings.',
    },
    options,
  );
  return querySpecificityResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'ambiguous' ? 'review' : 'ready',
  });
}

export {
  querySpecificityInputSchema,
  querySpecificityResultSchema,
  querySpecificityVerdictSchema,
} from './schema.js';
export type {
  QuerySpecificityInput,
  QuerySpecificityResult,
  QuerySpecificityVerdict,
} from './schema.js';
