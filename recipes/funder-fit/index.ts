import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { funderFitInputSchema, funderFitResultSchema } from './schema.js';
import type { FunderFitInput, FunderFitResult } from './schema.js';

export async function funderFit(
  input: FunderFitInput,
  options: RecipeOptions = {},
): Promise<FunderFitResult> {
  const { minConfidence = 0.8, ...state } = funderFitInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    "Which of firstOpportunity and secondOpportunity better fits program? Judge three things from the texts alone: whether the opportunity's stated purpose matches what program does, whether program as described meets the opportunity's stated eligibility wording such as organization type, geography, and population served, and whether the opportunity's stated scope, such as funding range and activity type, covers what program asks for. A stated eligibility exclusion outweighs a matching purpose. Ignore prestige, deadline, and how the opportunity is worded.",
    {
      first:
        "firstOpportunity matches program's purpose, eligibility wording, and scope better than secondOpportunity does.",
      second:
        "secondOpportunity matches program's purpose, eligibility wording, and scope better than firstOpportunity does.",
      tie: 'Both opportunities fit program about equally well on purpose, eligibility wording, and scope.',
      neither:
        'Neither opportunity fits program: each has a stated purpose, eligibility exclusion, or scope that does not cover it.',
    },
    options,
  );
  return funderFitResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export { funderFitInputSchema, funderFitResultSchema, funderFitVerdictSchema } from './schema.js';
export type { FunderFitInput, FunderFitResult, FunderFitVerdict } from './schema.js';
