import { evaluateChoice } from './decisions.js';
import { comparisonCriteriaSchema, comparisonVerdictSchema } from './schema.js';
import type { ComparisonCriteria, RecipeOptions } from './schema.js';

export async function evaluateComparison(
  state: Record<string, unknown>,
  instruction: string,
  criteria: ComparisonCriteria,
  options: RecipeOptions = {},
  questionName = 'decision',
) {
  const decision = await evaluateChoice(
    state,
    `${instruction} Treat presentation order as irrelevant. Allow a tie or neither.`,
    {
      ...comparisonCriteriaSchema.parse(criteria),
      unclear: 'There is insufficient information to make the comparison.',
    },
    options,
    questionName,
  );
  return { ...decision, verdict: comparisonVerdictSchema.parse(decision.verdict) };
}
