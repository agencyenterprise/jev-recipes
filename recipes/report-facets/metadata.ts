import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'report-facets',
  title: 'Label the facets of a progress report',
  description:
    'Which of these does report include: an outcome statement, supporting evidence, blockers, a next step, open questions?',
  category: 'workflow',
  tags: ['agent', 'reporting', 'labels', 'multi-label', 'status'],
  useWhen:
    'You need to check an agent progress report for the parts a supervisor expects before accepting it, routing it, or asking the agent to fill in what is missing.',
  related: [
    {
      id: 'result-outcome',
      reason:
        'Use result-outcome to classify what a reported result actually was, once the report is known to state one.',
    },
    {
      id: 'step-progress',
      reason:
        'Use step-progress to grade how far the reported work moved the objective, rather than what the report contains.',
    },
  ],
  limitations: [
    'Labels are independent, so a report can carry several or none.',
    'Detects that a facet is present, not that it is accurate. Evidence can be cited and still be wrong.',
  ],
} satisfies RecipeMetadata;
