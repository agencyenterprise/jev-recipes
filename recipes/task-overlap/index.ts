import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { taskOverlapInputSchema, taskOverlapResultSchema } from './schema.js';
import type { TaskOverlapInput, TaskOverlapResult } from './schema.js';

export async function taskOverlap(
  input: TaskOverlapInput,
  options: RecipeOptions = {},
): Promise<TaskOverlapResult> {
  const { minConfidence = 0.8, ...state } = taskOverlapInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Do firstTask and secondTask cover overlapping work, such that two workers doing them in parallel would duplicate effort or collide on the same files, records, or decisions? Count overlap when both tasks change or produce the same artifact, when one task is a subset of the other, or when completing one would make part of the other redundant. Do not count overlap when the tasks merely share a topic, a codebase, or a dependency while touching different things.',
    {
      true: 'The tasks cover overlapping work that two workers would duplicate or collide on.',
      false: 'The tasks cover distinct work that two workers could do independently.',
    },
    options,
  );
  return taskOverlapResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'overlapping' : 'disjoint',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  taskOverlapInputSchema,
  taskOverlapResultSchema,
  taskOverlapVerdictSchema,
} from './schema.js';
export type { TaskOverlapInput, TaskOverlapResult, TaskOverlapVerdict } from './schema.js';
