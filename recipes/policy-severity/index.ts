import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  policySeverityInputSchema,
  policySeverityResultSchema,
  policySeverityVerdictSchema,
} from './schema.js';
import type { PolicySeverityInput, PolicySeverityResult } from './schema.js';

export async function policySeverity(
  input: PolicySeverityInput,
  options: RecipeOptions = {},
): Promise<PolicySeverityResult> {
  const { minConfidence = 0.8, ...state } = policySeverityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How severely does content violate policy? Judge only against the rules stated in policy. Do not apply rules it does not state.',
    [
      'The content does not violate the policy.',
      'A borderline or technical violation with negligible potential for harm.',
      'A clear violation with limited potential for harm.',
      'A clear violation with substantial potential for harm to a person or group.',
      'A flagrant violation with severe or imminent potential for harm.',
    ],
    options,
  );
  return policySeverityResultSchema.parse({
    ...decision,
    severity: policySeverityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  policySeverityInputSchema,
  policySeverityResultSchema,
  policySeverityVerdictSchema,
} from './schema.js';
export type { PolicySeverityInput, PolicySeverityResult, PolicySeverityVerdict } from './schema.js';
