import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'task-dependency',
  title: 'Check the dependency between two tasks',
  description:
    'Identify whether either of two tasks requires the other to finish before it can start.',
  category: 'workflow',
  tags: ['tasks', 'dependency', 'prerequisite', 'order', 'parallel', 'planning', 'sequence'],
  useWhen:
    'You need to decide whether two tasks can run in parallel or require a particular order.',
  related: [
    {
      id: 'task-duplicate',
      reason: 'Use task-duplicate to detect repeated outcomes before scheduling tasks.',
    },
    {
      id: 'step-complete',
      reason:
        'Use step-complete to check whether evidence establishes a known prerequisite is already satisfied.',
    },
  ],
  limitations: [
    'Assesses only the supplied pair and prerequisites; does not build or validate a complete dependency graph.',
    "Independence of prerequisites does not establish that parallel execution is safe: shared resources, locks, permissions, and scheduling remain the caller's responsibility.",
  ],
} satisfies RecipeMetadata;
