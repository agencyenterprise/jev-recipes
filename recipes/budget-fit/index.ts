import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { budgetFitInputSchema, budgetFitResultSchema } from './schema.js';
import type { BudgetFitInput, BudgetFitResult } from './schema.js';

export async function budgetFit(
  input: BudgetFitInput,
  options: RecipeOptions = {},
): Promise<BudgetFitResult> {
  const { minConfidence = 0.8, ...state } = budgetFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does plan, as described, plausibly fit within budget, the stated limits on steps, time, cost, or calls? Estimate the steps, tool calls, elapsed time, and spend the plan would realistically need, including retries and waiting that the plan implies, and compare each against the matching limit in budget. Count the plan as exceeding when any single limit would plausibly be crossed. Treat a limit budget does not mention as unconstrained.',
    {
      true: 'The plan plausibly completes within every limit the budget states.',
      false: 'The plan would plausibly cross at least one limit the budget states.',
    },
    options,
  );
  return budgetFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'fits' : 'exceeds',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export { budgetFitInputSchema, budgetFitResultSchema, budgetFitVerdictSchema } from './schema.js';
export type { BudgetFitInput, BudgetFitResult, BudgetFitVerdict } from './schema.js';
