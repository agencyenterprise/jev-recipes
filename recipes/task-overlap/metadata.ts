import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'task-overlap',
  title: 'Detect overlapping tasks',
  description:
    'Do firstTask and secondTask cover overlapping work, such that two workers would duplicate or collide?',
  category: 'workflow',
  tags: ['agent', 'coordination', 'overlap', 'planning', 'multi-agent'],
  useWhen:
    'You are about to fan work out to several agents or people and need a yes/no check that two assignments will not step on each other.',
  related: [
    {
      id: 'task-duplicate',
      reason:
        'Use task-duplicate when the question is whether two items are the same request, rather than whether distinct requests share work.',
    },
    {
      id: 'task-dependency',
      reason:
        'Use task-dependency to check whether one task must finish before the other can start, which overlap does not imply.',
    },
  ],
  limitations: [
    'Judges overlap from the task descriptions alone. Tasks that touch the same files without saying so will look disjoint.',
    'Reports that overlap exists, not which task should absorb the shared work or how to split it.',
  ],
} satisfies RecipeMetadata;
