import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { ruleComplianceInputSchema, ruleComplianceResultSchema } from './schema.js';
import type { RuleComplianceInput, RuleComplianceResult } from './schema.js';

export async function ruleCompliance(
  input: RuleComplianceInput,
  options: RecipeOptions = {},
): Promise<RuleComplianceResult> {
  const { minConfidence = 0.8, ...state } = ruleComplianceInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Is action permitted by rules? Read rules as the complete authority. Treat the action as legal when nothing in rules forbids it and any conditions rules place on that kind of action are met by the details given in action. Treat it as illegal when rules forbid it outright, require a condition that action states is not met, or describe the action as available only in a situation action does not match. Do not apply rules that are not written in rules, and do not judge whether the action is wise.',
    {
      true: 'Nothing in the written rules forbids the action, and every condition the rules attach to that kind of action is satisfied by the details given.',
      false:
        'The written rules forbid the action, or attach a condition to it that the described situation does not satisfy.',
    },
    options,
  );
  return ruleComplianceResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'legal' : 'illegal',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  ruleComplianceInputSchema,
  ruleComplianceResultSchema,
  ruleComplianceVerdictSchema,
} from './schema.js';
export type { RuleComplianceInput, RuleComplianceResult, RuleComplianceVerdict } from './schema.js';
