import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { reconciliationMatchInputSchema, reconciliationMatchResultSchema } from './schema.js';
import type { ReconciliationMatchInput, ReconciliationMatchResult } from './schema.js';

export async function reconciliationMatch(
  input: ReconciliationMatchInput,
  options: RecipeOptions = {},
): Promise<ReconciliationMatchResult> {
  const { minConfidence = 0.8, ...state } = reconciliationMatchInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Read the ledger record and the statementLine from a bank or card statement. Decide whether they describe the same transaction by comparing who was paid, what the payment was for, and when it happened, as each is worded. Allow for abbreviations, processor names, and posting delays of a few days that are normal for statements. Do not rely on amounts or exact dates matching; the caller checks those separately.',
    {
      true: 'The payee, purpose, and timing wording of the two entries are consistent with a single transaction, allowing for abbreviated descriptors, processor names, and normal posting delays.',
      false:
        'The wording points to different payees, different purposes, or timing too far apart to be the same transaction.',
    },
    options,
  );
  return reconciliationMatchResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'same' : 'different',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  reconciliationMatchInputSchema,
  reconciliationMatchResultSchema,
  reconciliationMatchVerdictSchema,
} from './schema.js';
export type {
  ReconciliationMatchInput,
  ReconciliationMatchResult,
  ReconciliationMatchVerdict,
} from './schema.js';
