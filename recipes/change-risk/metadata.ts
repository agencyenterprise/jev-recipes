import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'change-risk',
  title: 'Grade change risk',
  description: 'How risky is change to ship, given context, on a five-level rubric?',
  category: 'workflow',
  tags: ['code-review', 'risk', 'change', 'deployment', 'pull-request'],
  useWhen:
    'You need to size the risk of a described code change before choosing reviewers, test depth, rollout strategy, or approval requirements.',
  related: [
    {
      id: 'task-complexity',
      reason:
        'Use task-complexity to grade how hard the work is, rather than how dangerous shipping it is.',
    },
    {
      id: 'action-scope',
      reason:
        'Use action-scope to check whether a change stays within the work that was requested.',
    },
  ],
  limitations: [
    'Grades the change as described, not the actual diff. An incomplete or misleading description produces a misleading grade.',
    'Does not verify test coverage or rollback tooling. Map levels to review and rollout policies in application code.',
  ],
} satisfies RecipeMetadata;
