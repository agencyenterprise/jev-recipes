import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'incident-severity-wording',
  title: 'Grade the severity an incident report describes',
  description:
    'What severity does the wording of report describe, on a five-level rubric from no user impact to total outage or data loss?',
  category: 'workflow',
  tags: ['incident-response', 'severity', 'on-call', 'devops', 'score', 'triage'],
  useWhen:
    'You need a first severity estimate from a free-text incident report, alert summary, or status update before a human incident commander confirms it, or you want to check that a declared severity matches how the report describes the impact.',
  related: [
    {
      id: 'issue-impact',
      reason:
        'Use issue-impact for bug reports and feature requests where the question is how many users a problem affects rather than how large an outage is.',
    },
    {
      id: 'policy-severity',
      reason:
        'Use policy-severity to grade how serious a policy violation is, rather than how serious an operational incident is.',
    },
  ],
  limitations: [
    'Grades what the report says, not measured impact. An understated report yields an understated grade.',
    'Does not know your severity matrix or SLAs. Map levels to your own SEV scale and paging rules in application code.',
    'Does not distinguish a report written during an incident from one written after recovery.',
  ],
} satisfies RecipeMetadata;
