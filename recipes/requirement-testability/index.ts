import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { requirementTestabilityInputSchema, requirementTestabilityResultSchema } from './schema.js';
import type { RequirementTestabilityInput, RequirementTestabilityResult } from './schema.js';

export async function requirementTestability(
  input: RequirementTestabilityInput,
  options: RecipeOptions = {},
): Promise<RequirementTestabilityResult> {
  const { minConfidence = 0.8, ...state } = requirementTestabilityInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do requirement and context define an observable way to distinguish meeting this requirement from failing it? Judge the stated acceptance criteria, not feasibility, current implementation, or whether it already passes. A criterion can be qualitative if the supplied definitions make the expected observation clear. Do not invent thresholds, measurement conditions, definitions, or a test procedure. Choose not_testable when the intended requirement is understandable but its completion criteria remain subjective or unbounded; choose unclear when the requirement itself or a reference cannot be interpreted.',
    {
      testable:
        'The supplied requirement and definitions establish observable conditions for distinguishing pass from fail.',
      not_testable:
        'The intended requirement is understandable, but the supplied criteria do not define an observable pass/fail boundary.',
      unclear:
        'The requirement or its references are too ambiguous to determine what would need to be observed.',
    },
    options,
  );
  return requirementTestabilityResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  requirementTestabilityInputSchema,
  requirementTestabilityResultSchema,
  requirementTestabilityVerdictSchema,
} from './schema.js';
export type {
  RequirementTestabilityInput,
  RequirementTestabilityResult,
  RequirementTestabilityVerdict,
} from './schema.js';
