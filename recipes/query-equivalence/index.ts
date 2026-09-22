import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { queryEquivalenceInputSchema, queryEquivalenceResultSchema } from './schema.js';
import type { QueryEquivalenceInput, QueryEquivalenceResult } from './schema.js';

export async function queryEquivalence(
  input: QueryEquivalenceInput,
  options: RecipeOptions = {},
): Promise<QueryEquivalenceResult> {
  const { minConfidence = 0.8, ...state } = queryEquivalenceInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do firstQuestion and secondQuestion request the same information under the same stated conditions? Shared vocabulary or topic alone is not equivalence.',
    {
      equivalent: 'Both questions request the same information with compatible conditions.',
      related: 'They share a topic but differ in a material information need or condition.',
      different: 'They request different subjects or unrelated information.',
      unclear: 'The intended meanings cannot be resolved.',
    },
    options,
  );
  return queryEquivalenceResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  queryEquivalenceInputSchema,
  queryEquivalenceResultSchema,
  queryEquivalenceVerdictSchema,
} from './schema.js';
export type {
  QueryEquivalenceInput,
  QueryEquivalenceResult,
  QueryEquivalenceVerdict,
} from './schema.js';
