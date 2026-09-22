import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { taskDependencyInputSchema, taskDependencyResultSchema } from './schema.js';
import type { TaskDependencyInput, TaskDependencyResult } from './schema.js';

export async function taskDependency(
  input: TaskDependencyInput,
  options: RecipeOptions = {},
): Promise<TaskDependencyResult> {
  const { minConfidence = 0.8, ...state } = taskDependencyInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Does either of firstTask and secondTask require the other to finish before it can start, using only their descriptions and context? Judge necessary prerequisites, not a preferred or convenient order. Never infer a dependency from the order in which tasks are supplied. Shared subject matter or duplicate work alone does not establish a dependency. Choose independent only when the supplied facts establish that both can start without the other finishing. Missing prerequisite information is unclear, not independence.',
    {
      first_before_second:
        'The second task needs the first task to finish, and the first does not need the second to finish.',
      second_before_first:
        'The first task needs the second task to finish, and the second does not need the first to finish.',
      independent:
        'Neither task needs the other to finish before it can start under the supplied conditions.',
      cyclic: 'Each task requires the other to finish before it can start.',
      unclear: 'The supplied descriptions do not establish the prerequisite relationship.',
    },
    options,
  );
  return taskDependencyResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  taskDependencyInputSchema,
  taskDependencyResultSchema,
  taskDependencyVerdictSchema,
} from './schema.js';
export type { TaskDependencyInput, TaskDependencyResult, TaskDependencyVerdict } from './schema.js';
