import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { entityMatchInputSchema, entityMatchResultSchema } from './schema.js';
import type { EntityMatchInput, EntityMatchResult } from './schema.js';

export async function entityMatch(
  input: EntityMatchInput,
  options: RecipeOptions = {},
): Promise<EntityMatchResult> {
  const { minConfidence = 0.8, ...state } = entityMatchInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Do firstRecord and secondRecord describe the same real-world entity, such as the same person, organization, product, or place? Look through formatting differences, abbreviations, reordered or partially filled fields, and typos. Use any context to interpret the fields. Two records are different when a distinguishing detail conflicts, not merely when one record has fields the other lacks.',
    {
      true: 'The two records describe the same real-world entity.',
      false: 'The two records describe different entities, or a distinguishing detail conflicts.',
    },
    options,
  );
  return entityMatchResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'same' : 'different',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  entityMatchInputSchema,
  entityMatchResultSchema,
  entityMatchVerdictSchema,
} from './schema.js';
export type { EntityMatchInput, EntityMatchResult, EntityMatchVerdict } from './schema.js';
