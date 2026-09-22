import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'task-duplicate',
  title: 'Compare tasks for duplicate work',
  description:
    'Decide whether two tasks request the same outcome, overlapping work, or distinct work.',
  category: 'workflow',
  tags: ['tasks', 'duplicate', 'overlap', 'queue', 'deduplicate', 'planning', 'same', 'outcome'],
  useWhen: 'You need to detect duplicate tasks before adding more work to a queue or plan.',
  related: [
    {
      id: 'repeated-attempt',
      reason: 'Use repeated-attempt to compare the methods of two attempts toward one objective.',
    },
    {
      id: 'task-dependency',
      reason: 'Use task-dependency to check whether one task must finish before another starts.',
    },
    {
      id: 'ticket-match',
      reason: 'Use ticket-match to compare reported issues rather than requested work.',
    },
  ],
  limitations: [
    'Assesses described work only; does not merge queue entries, cancel tasks, or prove that an external action is safe to repeat.',
    'Shared topics or similar titles are insufficient to establish duplicate work.',
  ],
} satisfies RecipeMetadata;
