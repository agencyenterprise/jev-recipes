import { evaluateChecks } from '../../src/checks.js';
import type { RecipeOptions } from '../../src/schema.js';
import { handoffInputSchema, handoffResultSchema } from './schema.js';
import type { HandoffInput, HandoffResult } from './schema.js';

export async function handoff(input: HandoffInput, options: RecipeOptions = {}): Promise<HandoffResult> {
  const { request, context, rules, minConfidence = 0.8 } = handoffInputSchema.parse(input);
  const evaluation = await evaluateChecks(
    { request, context: context ?? '', rules },
    rules,
    (index) => `Does rules[${index}].description apply to the request and context? ` +
      'Choose unclear when missing or conflicting facts prevent deciding this rule.',
    {
      matches: 'The supplied facts establish that this handoff rule applies.',
      does_not_match: 'The supplied facts establish that this handoff rule does not apply.',
      unclear: 'The supplied facts do not establish whether this rule applies.',
    },
    options,
    'rule',
  );
  const checks = evaluation.checks.map((check) => ({
    ...check,
    status: check.confidence >= minConfidence ? 'ready' : 'review',
  }));
  const matchedRules = checks.filter((check) => check.status === 'ready' && check.verdict === 'matches').map((check) => check.id);
  const uncertainRules = checks.filter((check) => check.status === 'review' || check.verdict === 'unclear').map((check) => check.id);
  const decision = matchedRules.length > 0 ? 'human' : uncertainRules.length > 0 ? 'review' : 'continue';

  return handoffResultSchema.parse({
    ...evaluation,
    checks,
    status: decision === 'review' ? 'review' : 'ready',
    decision,
    matchedRules,
    uncertainRules,
  });
}

export { handoffInputSchema, handoffResultSchema } from './schema.js';
export type { HandoffInput, HandoffRule, HandoffResult, HandoffVerdict } from './schema.js';
