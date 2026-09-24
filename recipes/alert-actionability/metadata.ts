import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'alert-actionability',
  title: 'Grade how actionable an alert is',
  description:
    'How actionable is alert for the on-call engineer who receives it, on a five-level rubric from pure noise to a guided first step?',
  category: 'workflow',
  tags: ['on-call', 'alerting', 'incident-response', 'devops', 'score', 'monitoring'],
  useWhen:
    'You need to triage or audit alert text before paging someone: to route noisy alerts to a digest, to flag vague alerts for rewriting, or to rank a flood of alerts by how much they tell the responder.',
  related: [
    {
      id: 'feedback-actionability',
      reason:
        'Use feedback-actionability for review comments and user feedback rather than operational alerts.',
    },
    {
      id: 'issue-impact',
      reason:
        'Use issue-impact to grade how much a reported problem matters, rather than how well the alert tells you what to do about it.',
    },
  ],
  limitations: [
    'Grades what the alert text tells the responder, not whether the alert is true or whether the named component is really at fault.',
    'Does not know your service topology or runbooks. Context can supply that, but the grade stays a judgment about the wording.',
    'Deduplication, paging policy, and escalation timers belong in application code.',
  ],
} satisfies RecipeMetadata;
