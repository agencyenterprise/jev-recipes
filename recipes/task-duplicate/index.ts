import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { taskDuplicateInputSchema, taskDuplicateResultSchema } from './schema.js';
import type { TaskDuplicateInput, TaskDuplicateResult } from './schema.js';

export async function taskDuplicate(
  input: TaskDuplicateInput,
  options: RecipeOptions = {},
): Promise<TaskDuplicateResult> {
  const { minConfidence = 0.8, ...state } = taskDuplicateInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Do firstTask and secondTask request the same completed outcome under the same scope in context? Compare targets, deliverables, time periods, and constraints, not just wording or methods. Different methods can produce the same requested outcome. The same method applied to different targets is not duplicate work. Choose duplicate only when completing either task would fully satisfy the other; use overlapping when shared requested work leaves a material requirement unique to at least one task. Do not assume that matching titles identify the same task.',
    {
      duplicate:
        'Completing either task would fully satisfy the other under the same scope and constraints.',
      overlapping:
        'The tasks share requested work, but at least one includes material work the other does not.',
      distinct:
        'The tasks have separate requested outcomes or incompatible scopes with no shared requested work.',
      unclear:
        'Their targets, scope, or intended outcomes cannot be compared from the supplied information.',
    },
    options,
  );
  return taskDuplicateResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  taskDuplicateInputSchema,
  taskDuplicateResultSchema,
  taskDuplicateVerdictSchema,
} from './schema.js';
export type { TaskDuplicateInput, TaskDuplicateResult, TaskDuplicateVerdict } from './schema.js';
