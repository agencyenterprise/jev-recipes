import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'tool-compare',
  title: 'Compare two tools for a task',
  description:
    'Which of firstTool and secondTool, as described by their stated capabilities, better fits task?',
  category: 'workflow',
  tags: ['agent', 'tool-use', 'comparison', 'pairwise', 'planning', 'workflow'],
  useWhen:
    'An agent has two candidate tools for one step and needs a head-to-head preference based on the capability descriptions it has been given.',
  related: [
    {
      id: 'tool-fit',
      reason: 'Use tool-fit to check whether a single tool can perform the task at all.',
    },
    {
      id: 'action-compare',
      reason:
        'Use action-compare to compare two next steps against a goal, rather than two tools against one task.',
    },
  ],
  limitations: [
    'Compares the capability descriptions as written. It does not invoke either tool, check credentials, or know about tools not supplied.',
    'A tool can fit the task better and still be unavailable, rate-limited, or forbidden; availability and permission belong in application code.',
  ],
} satisfies RecipeMetadata;
