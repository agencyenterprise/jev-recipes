import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'change-window-fit',
  title: 'Check a change against a change-window policy',
  description: 'Does the described change fall within the written change-window or freeze policy?',
  category: 'workflow',
  tags: ['change-management', 'deployment', 'devops', 'policy', 'gate', 'on-call'],
  useWhen:
    'A deploy or infrastructure change is proposed in free text and you want a first read on whether it is permitted under a written change-window or freeze policy before a human approver looks at it.',
  related: [
    {
      id: 'slot-fit',
      reason:
        'Use slot-fit to check whether a proposed time matches a stated availability window in scheduling contexts, rather than a deployment policy.',
    },
    {
      id: 'action-scope',
      reason:
        'Use action-scope to check whether an action stays within what was requested, rather than whether its timing is allowed.',
    },
  ],
  limitations: [
    'Dates, times, time zones, and business-day arithmetic must be compared in application code. The recipe reads the texts as written and does not compute calendar facts.',
    'Judges the change as described against the policy as written. It does not know about approvals, exceptions, or freeze calendars that are not in policy.',
    'A blocked verdict is a flag for an approver, not an enforcement decision.',
  ],
} satisfies RecipeMetadata;
