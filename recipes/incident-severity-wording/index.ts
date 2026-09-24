import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  incidentSeverityWordingInputSchema,
  incidentSeverityWordingResultSchema,
  incidentSeverityWordingVerdictSchema,
} from './schema.js';
import type { IncidentSeverityWordingInput, IncidentSeverityWordingResult } from './schema.js';

export async function incidentSeverityWording(
  input: IncidentSeverityWordingInput,
  options: RecipeOptions = {},
): Promise<IncidentSeverityWordingResult> {
  const { minConfidence = 0.8, ...state } = incidentSeverityWordingInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    "What severity does the wording of report describe? Judge only the user-facing impact that report states or clearly implies: which functionality is affected, what fraction of users or traffic, and whether data was lost. Ignore the reporter's own severity label, tone, and urgency words, and ignore internal effort or cost unless users are affected.",
    [
      'The report describes no user-facing impact: an internal anomaly, a near miss, or a problem caught before users saw it.',
      'The report describes degraded but working service for users, such as slower responses, a cosmetic fault, or a failure with an easy workaround.',
      'The report describes one feature, region, or user segment failing outright while the rest of the service keeps working.',
      'The report describes core functionality failing for most users, with the service still partly reachable.',
      'The report describes the whole service down for everyone, or data being lost, corrupted, or exposed.',
    ],
    options,
  );
  return incidentSeverityWordingResultSchema.parse({
    ...decision,
    severity: incidentSeverityWordingVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  incidentSeverityWordingInputSchema,
  incidentSeverityWordingResultSchema,
  incidentSeverityWordingVerdictSchema,
} from './schema.js';
export type {
  IncidentSeverityWordingInput,
  IncidentSeverityWordingResult,
  IncidentSeverityWordingVerdict,
} from './schema.js';
