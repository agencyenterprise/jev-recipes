import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  alertActionabilityInputSchema,
  alertActionabilityResultSchema,
  alertActionabilityVerdictSchema,
} from './schema.js';
import type { AlertActionabilityInput, AlertActionabilityResult } from './schema.js';

export async function alertActionability(
  input: AlertActionabilityInput,
  options: RecipeOptions = {},
): Promise<AlertActionabilityResult> {
  const { minConfidence = 0.8, ...state } = alertActionabilityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How actionable is alert for the on-call engineer who receives it? Judge only what the text of alert tells a responder: whether it names an observable symptom, whether it points at a specific component or location, and whether it suggests a concrete first step. Use context only to interpret abbreviations or service names. Ignore formatting, severity labels, and whether the alert is likely to be a true positive.',
    [
      'The alert gives the responder nothing to act on: no symptom, no component, and no threshold, such as a bare status code or a heartbeat with no failure described.',
      "The alert hints that something is wrong but names neither a concrete symptom nor a component, such as 'service degraded' or 'errors detected'.",
      'The alert names an observable symptom with a measure or threshold, such as an error rate or latency figure, but does not say where it is happening.',
      'The alert names both the symptom and the specific component, host, region, or dependency involved, so the responder knows where to look first.',
      'The alert names the symptom, the component, and a concrete first step, link, or runbook the responder can follow immediately.',
    ],
    options,
  );
  return alertActionabilityResultSchema.parse({
    ...decision,
    actionability: alertActionabilityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  alertActionabilityInputSchema,
  alertActionabilityResultSchema,
  alertActionabilityVerdictSchema,
} from './schema.js';
export type {
  AlertActionabilityInput,
  AlertActionabilityResult,
  AlertActionabilityVerdict,
} from './schema.js';
