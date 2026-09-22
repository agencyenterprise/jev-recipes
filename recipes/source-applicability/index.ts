import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { sourceApplicabilityInputSchema, sourceApplicabilityResultSchema } from './schema.js';
import type { SourceApplicabilityInput, SourceApplicabilityResult } from './schema.js';

export async function sourceApplicability(
  input: SourceApplicabilityInput,
  options: RecipeOptions = {},
): Promise<SourceApplicabilityResult> {
  const { minConfidence = 0.8, ...state } = sourceApplicabilityInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does the scope described in passage apply to scenario? Distinguish applicable information from information about another product, environment, role, or condition.',
    {
      applies: 'The passage explicitly covers or unambiguously applies to the scenario.',
      does_not_apply: 'The passage is scoped to incompatible circumstances.',
      unclear: 'Required scope information is missing or ambiguous.',
    },
    options,
  );
  return sourceApplicabilityResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  sourceApplicabilityInputSchema,
  sourceApplicabilityResultSchema,
  sourceApplicabilityVerdictSchema,
} from './schema.js';
export type {
  SourceApplicabilityInput,
  SourceApplicabilityResult,
  SourceApplicabilityVerdict,
} from './schema.js';
