import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'budget-fit',
  title: 'Check plan against budget',
  description:
    'Does plan, as described, plausibly fit within budget, the stated limits on steps, time, cost, or calls?',
  category: 'workflow',
  tags: ['agent', 'planning', 'budget', 'limits', 'gate'],
  useWhen:
    'You need a yes/no check before an agent starts executing a plan under a step, time, cost, or call limit, so it can trim or ask instead of running out midway.',
  related: [
    {
      id: 'task-complexity',
      reason:
        'Use task-complexity to size a task on a rubric before a budget exists, rather than checking a plan against a stated one.',
    },
    {
      id: 'plan-completeness',
      reason:
        'Use plan-completeness to check that the plan covers its goal; a plan can fit the budget by leaving work out.',
    },
  ],
  limitations: [
    'A semantic estimate from the plan and budget as written, not a measurement. Enforce hard limits in code.',
    'Reports that the plan plausibly fits or exceeds, not by how much or which step to cut.',
  ],
} satisfies RecipeMetadata;
