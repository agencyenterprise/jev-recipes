import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { budgetNarrativeFitInputSchema, budgetNarrativeFitResultSchema } from './schema.js';
import type { BudgetNarrativeFitInput, BudgetNarrativeFitResult } from './schema.js';

export async function budgetNarrativeFit(
  input: BudgetNarrativeFitInput,
  options: RecipeOptions = {},
): Promise<BudgetNarrativeFitResult> {
  const { minConfidence = 0.8, ...state } = budgetNarrativeFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does narrative explain every line item in lineItems, and does every expense narrative explains correspond to an item in lineItems? Match items by what the expense is for, not by exact wording, order, or heading; a narrative paragraph may cover an item under a different name or fold two listed items into one sentence. Do not check whether the amounts agree, add up, or are reasonable. Judge only coverage in both directions.',
    {
      true: 'Every line item in lineItems has an explanation in narrative, and every expense narrative explains corresponds to a listed line item.',
      false:
        'At least one listed line item has no explanation in narrative, or narrative explains an expense that lineItems does not contain.',
    },
    options,
  );
  return budgetNarrativeFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'aligned' : 'misaligned',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  budgetNarrativeFitInputSchema,
  budgetNarrativeFitResultSchema,
  budgetNarrativeFitVerdictSchema,
} from './schema.js';
export type {
  BudgetNarrativeFitInput,
  BudgetNarrativeFitResult,
  BudgetNarrativeFitVerdict,
} from './schema.js';
