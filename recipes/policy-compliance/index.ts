import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { policyComplianceInputSchema, policyComplianceResultSchema } from './schema.js';
import type { PolicyComplianceInput, PolicyComplianceResult } from './schema.js';

export async function policyCompliance(
  input: PolicyComplianceInput,
  options: RecipeOptions = {},
): Promise<PolicyComplianceResult> {
  const { minConfidence = 0.8, ...state } = policyComplianceInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Read the expense description and the written policy. Decide whether the expense, as described, complies with every rule in the policy that applies to it. An expense is noncompliant when the description states a fact that a policy rule forbids or when it omits something the policy explicitly requires for that kind of expense. Judge only the described facts against the written rules; do not assume facts that are not stated and do not apply rules the policy does not contain.',
    {
      true: 'Nothing in the expense description contradicts an applicable rule in the policy, and every requirement the policy states for this kind of expense is met by the description.',
      false:
        'The expense description states a fact that an applicable policy rule forbids, or omits a condition the policy explicitly requires for this kind of expense.',
    },
    options,
  );
  return policyComplianceResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'compliant' : 'noncompliant',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  policyComplianceInputSchema,
  policyComplianceResultSchema,
  policyComplianceVerdictSchema,
} from './schema.js';
export type {
  PolicyComplianceInput,
  PolicyComplianceResult,
  PolicyComplianceVerdict,
} from './schema.js';
