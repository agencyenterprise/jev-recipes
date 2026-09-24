import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'bug-report-completeness',
  title: 'Grade bug report completeness',
  description:
    'How complete is report for someone to reproduce and triage it, on a five-level rubric?',
  category: 'workflow',
  tags: ['code-review', 'bug-report', 'triage', 'issue', 'reproduction', 'rubric'],
  useWhen:
    'You need to decide whether an incoming bug report can go straight to triage or needs a follow-up request for details first.',
  related: [
    {
      id: 'clarify',
      reason:
        'Use clarify to name the specific missing or ambiguous details once a report grades incomplete.',
    },
    {
      id: 'requirement-testability',
      reason:
        'Use requirement-testability to check whether a described expected behavior can be verified.',
    },
  ],
  limitations: [
    'Grades the presence of reproduction elements, not their accuracy. A report can be complete and still describe the wrong cause.',
    'Does not judge severity or priority. Route and escalation rules belong in application code.',
  ],
} satisfies RecipeMetadata;
