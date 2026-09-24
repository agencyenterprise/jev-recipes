import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  deadlineRiskInputSchema,
  deadlineRiskResultSchema,
  deadlineRiskVerdictSchema,
} from './schema.js';
import type { DeadlineRiskInput, DeadlineRiskResult } from './schema.js';

export async function deadlineRisk(
  input: DeadlineRiskInput,
  options: RecipeOptions = {},
): Promise<DeadlineRiskResult> {
  const { minConfidence = 0.8, ...state } = deadlineRiskInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How at risk is the work of missing deadline, given progress? Weigh the remaining work, open blockers, dependencies on unavailable people or systems, and the time the texts say is left. Judge only what the two texts state; do not compute dates yourself beyond what the texts make explicit, and do not assume effort or blockers the texts do not describe.',
    [
      'The described remaining work fits comfortably in the stated time with no open blockers, so the deadline is on track.',
      'The work is likely to land on time but the texts note a small open item, a tight margin, or a dependency that could slip.',
      'Meeting the deadline is plausible but depends on something unresolved, such as a blocker with a known fix not yet applied or a review not yet scheduled.',
      'The described remaining work or blockers do not fit the stated time without a change, such as an undiagnosed failure, a missing person, or scope still unfinished with little time left.',
      'The texts state that the deadline has already passed, or the remaining work plainly cannot be done in the time described.',
    ],
    options,
  );
  return deadlineRiskResultSchema.parse({
    ...decision,
    risk: deadlineRiskVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  deadlineRiskInputSchema,
  deadlineRiskResultSchema,
  deadlineRiskVerdictSchema,
} from './schema.js';
export type { DeadlineRiskInput, DeadlineRiskResult, DeadlineRiskVerdict } from './schema.js';
