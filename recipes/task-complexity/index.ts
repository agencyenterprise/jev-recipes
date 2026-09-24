import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  taskComplexityInputSchema,
  taskComplexityResultSchema,
  taskComplexityVerdictSchema,
} from './schema.js';
import type { TaskComplexityInput, TaskComplexityResult } from './schema.js';

export async function taskComplexity(
  input: TaskComplexityInput,
  options: RecipeOptions = {},
): Promise<TaskComplexityResult> {
  const { minConfidence = 0.8, ...state } = taskComplexityInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How complex is task, given any context? Judge the number of distinct steps, the judgment each step needs, and how clearly completion is defined. Ignore the length of the wording.',
    [
      'A single direct step or lookup with an unambiguous completion condition.',
      'A few sequential steps using one kind of tool or source, needing little judgment.',
      'Several steps across more than one tool or source, needing some judgment or intermediate results.',
      'Many interdependent steps with ambiguity, trade-offs, or coordination to resolve along the way.',
      'Open-ended investigation or design work with no clearly defined completion condition.',
    ],
    options,
  );
  return taskComplexityResultSchema.parse({
    ...decision,
    complexity: taskComplexityVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  taskComplexityInputSchema,
  taskComplexityResultSchema,
  taskComplexityVerdictSchema,
} from './schema.js';
export type { TaskComplexityInput, TaskComplexityResult, TaskComplexityVerdict } from './schema.js';
