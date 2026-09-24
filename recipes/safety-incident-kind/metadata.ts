import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'safety-incident-kind',
  title: 'Classify a safety event',
  description:
    'What kind of safety event does report describe: a near miss, a first-aid injury, a medical-treatment injury, property damage, an environmental release, or an unsafe condition?',
  category: 'workflow',
  tags: ['manufacturing', 'safety', 'ehs', 'incident', 'classification', 'choice'],
  useWhen:
    'You need to sort free-text safety reports from workers, supervisors, or contractors into a fixed set of event kinds so each can be routed to the right investigation, form, or notification path.',
  related: [
    {
      id: 'incident-severity-wording',
      reason:
        'Use incident-severity-wording to grade how severe an operational outage is, rather than what kind of workplace safety event occurred.',
    },
    {
      id: 'failure-kind',
      reason:
        'Use failure-kind when the categories are caller-supplied rather than this fixed set of safety event kinds.',
    },
  ],
  limitations: [
    'Classifies what the report describes, not what happened. An understated report yields an understated kind.',
    'Does not decide recordability, reportability, or lost-time status under any regulation. Map kinds to your regulatory and notification rules in application code.',
    'A report describing several events is classified by the most consequential one; split multi-event reports in code when each matters.',
  ],
} satisfies RecipeMetadata;
