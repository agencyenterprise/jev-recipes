import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { clauseConflictInputSchema, clauseConflictResultSchema } from './schema.js';
import type { ClauseConflictInput, ClauseConflictResult } from './schema.js';

export async function clauseConflict(
  input: ClauseConflictInput,
  options: RecipeOptions = {},
): Promise<ClauseConflictResult> {
  const { minConfidence = 0.8, ...state } = clauseConflictInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Do firstClause and secondClause impose requirements that cannot both be satisfied? Compare what each clause requires, permits, or forbids, including its conditions and exceptions. Count a conflict only when a party following one clause would necessarily breach the other under the same circumstances. Different wording, overlapping subject matter, or one clause being stricter than the other is not a conflict when both can still be honored. Do not decide which clause prevails.',
    {
      true: 'A party cannot comply with both clauses at the same time.',
      false: 'Both clauses can be complied with at the same time.',
    },
    options,
  );
  return clauseConflictResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'conflict' : 'compatible',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  clauseConflictInputSchema,
  clauseConflictResultSchema,
  clauseConflictVerdictSchema,
} from './schema.js';
export type { ClauseConflictInput, ClauseConflictResult, ClauseConflictVerdict } from './schema.js';
