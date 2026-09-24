import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  planCompletenessInputSchema,
  planCompletenessResultSchema,
  planCompletenessVerdictSchema,
} from './schema.js';
import type { PlanCompletenessInput, PlanCompletenessResult } from './schema.js';

export async function planCompleteness(
  input: PlanCompletenessInput,
  options: RecipeOptions = {},
): Promise<PlanCompletenessResult> {
  const { minConfidence = 0.8, ...state } = planCompletenessInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How completely does plan cover what task requires? Identify every requirement that task states or clearly implies, then check whether plan contains a step addressing each one and whether it includes a way to verify the outcome. Judge coverage of requirements, not the writing quality or the ordering of steps.',
    [
      'The plan addresses none of the requirements in the task, or it targets a different task altogether.',
      'The plan addresses a minority of the requirements and leaves most of the task unplanned.',
      'The plan addresses most of the requirements but leaves notable gaps that would leave the task unfinished if it were followed as written.',
      'The plan addresses every requirement with only minor gaps in detail, but it does not describe how the outcome will be verified.',
      'The plan addresses every requirement and includes a step that verifies the task has been done.',
    ],
    options,
  );
  return planCompletenessResultSchema.parse({
    ...decision,
    completeness: planCompletenessVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  planCompletenessInputSchema,
  planCompletenessResultSchema,
  planCompletenessVerdictSchema,
} from './schema.js';
export type {
  PlanCompletenessInput,
  PlanCompletenessResult,
  PlanCompletenessVerdict,
} from './schema.js';
