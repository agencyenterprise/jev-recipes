import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  bugReportCompletenessInputSchema,
  bugReportCompletenessResultSchema,
  bugReportCompletenessVerdictSchema,
} from './schema.js';
import type { BugReportCompletenessInput, BugReportCompletenessResult } from './schema.js';

export async function bugReportCompleteness(
  input: BugReportCompletenessInput,
  options: RecipeOptions = {},
): Promise<BugReportCompletenessResult> {
  const { minConfidence = 0.8, ...state } = bugReportCompletenessInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How complete is report for someone to reproduce and triage it? Check for steps to reproduce, the expected behavior, the actual behavior, and the environment or version. Judge what is present, not how politely or how long it is written.',
    [
      'The report is only a complaint or request for help with no described symptom.',
      'The report describes a symptom but gives no steps to reproduce and no expected behavior.',
      'The report gives either steps to reproduce or expected-versus-actual behavior, but not both.',
      'The report gives steps, expected behavior, and actual behavior but omits the environment or version.',
      'The report gives steps, expected behavior, actual behavior, and the environment or version.',
    ],
    options,
  );
  return bugReportCompletenessResultSchema.parse({
    ...decision,
    completeness: bugReportCompletenessVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  bugReportCompletenessInputSchema,
  bugReportCompletenessResultSchema,
  bugReportCompletenessVerdictSchema,
} from './schema.js';
export type {
  BugReportCompletenessInput,
  BugReportCompletenessResult,
  BugReportCompletenessVerdict,
} from './schema.js';
