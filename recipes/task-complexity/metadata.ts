import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'task-complexity',
  title: 'Grade task complexity',
  description:
    'How complex is task, from a single lookup to open-ended work, on a five-level rubric?',
  category: 'workflow',
  tags: ['task', 'complexity', 'planning', 'budget', 'rubric', 'score', 'agent'],
  useWhen:
    'You need to size a task before choosing a model, a plan depth, a time budget, or whether to ask for help.',
  related: [
    {
      id: 'route',
      reason: 'Use route to pick a named handler once the task is sized.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to find missing requirements in a task that grades complex or open-ended.',
    },
  ],
  limitations: [
    'Grades the described work, not the effort a specific system will spend. Map levels to budgets in code.',
    'Does not detect whether the task is possible or permitted.',
  ],
} satisfies RecipeMetadata;
