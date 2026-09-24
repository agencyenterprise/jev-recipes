import { evaluateComparison } from '../../src/comparisons.js';
import type { RecipeOptions } from '../../src/schema.js';
import { priorityCompareInputSchema, priorityCompareResultSchema } from './schema.js';
import type { PriorityCompareInput, PriorityCompareResult } from './schema.js';

export async function priorityCompare(
  input: PriorityCompareInput,
  options: RecipeOptions = {},
): Promise<PriorityCompareResult> {
  const { minConfidence = 0.8, ...state } = priorityCompareInputSchema.parse(input);
  const decision = await evaluateComparison(
    state,
    'Which of firstTask and secondTask should be done first under criteria? Apply only the stated criteria, such as deadlines, impact, dependencies, or effort, and not a general sense of importance. A task the criteria exclude or defer entirely should not be done at all.',
    {
      first: 'Under the criteria, the first task should be done before the second.',
      second: 'Under the criteria, the second task should be done before the first.',
      tie: 'Under the criteria, the order of the two tasks does not matter.',
      neither: 'Under the criteria, neither task should be done at all.',
    },
    options,
  );
  return priorityCompareResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  priorityCompareInputSchema,
  priorityCompareResultSchema,
  priorityCompareVerdictSchema,
} from './schema.js';
export type {
  PriorityCompareInput,
  PriorityCompareResult,
  PriorityCompareVerdict,
} from './schema.js';
