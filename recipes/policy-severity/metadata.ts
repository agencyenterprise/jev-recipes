import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'policy-severity',
  title: 'Grade a policy violation',
  description: 'How severely does content violate the supplied policy, on a five-level rubric?',
  category: 'conversation',
  tags: ['moderation', 'policy', 'safety', 'severity', 'rubric', 'score'],
  useWhen:
    'You need a graded severity against your own written policy to choose between allow, flag, hide, or escalate.',
  related: [
    {
      id: 'handoff',
      reason: 'Use handoff to decide whether a case matches your human escalation rules.',
    },
    {
      id: 'promise-check',
      reason: 'Use promise-check to catch replies that commit beyond what your rules allow.',
    },
  ],
  limitations: [
    'Judges only against the supplied policy text. It has no built-in content rules.',
    'Severity is a semantic grade. Enforcement actions, appeals, and legal obligations belong in application code.',
  ],
} satisfies RecipeMetadata;
