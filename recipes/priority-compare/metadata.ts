import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'priority-compare',
  title: 'Compare two tasks for priority',
  description: 'Which of firstTask and secondTask should be done first under criteria?',
  category: 'workflow',
  tags: ['prioritization', 'planning', 'comparison', 'pairwise', 'workflow'],
  useWhen:
    'A planner or agent must order two competing tasks and the team has written down how priority should be decided.',
  related: [
    {
      id: 'action-compare',
      reason:
        'Use action-compare to choose which of two next steps better advances a goal rather than which of two tasks to schedule first.',
    },
    {
      id: 'task-dependency',
      reason:
        'Use task-dependency to establish whether one task must finish before the other can start, which is a hard ordering rather than a priority call.',
    },
  ],
  limitations: [
    'Orders two tasks under the criteria as written. It does not check that the criteria are sensible or complete, and it does not know about tasks outside the pair.',
    'A neither verdict means the criteria rule both tasks out; it does not mean they are impossible or harmful.',
  ],
} satisfies RecipeMetadata;
