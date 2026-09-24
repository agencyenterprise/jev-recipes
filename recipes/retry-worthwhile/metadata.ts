import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'retry-worthwhile',
  title: 'Decide whether to retry',
  description:
    'Does failure describe a transient condition where an identical retry could succeed, given any attempt history?',
  category: 'workflow',
  tags: ['agent', 'retry', 'failure', 'resilience', 'transient', 'gate'],
  useWhen:
    'You need a yes/no decision after a tool call or request fails and the error text, not a status code, is the only signal you have.',
  related: [
    {
      id: 'failure-kind',
      reason:
        'Use failure-kind to place the failure in one of your own categories when you need more than a retry or stop answer.',
    },
    {
      id: 'repeated-attempt',
      reason:
        'Use repeated-attempt to check whether a proposed next attempt is really a fresh approach rather than the same one again.',
    },
  ],
  limitations: [
    'Judges the failure text as written. It does not know your retry budget, backoff policy, or whether the action is safe to repeat.',
    'Says whether an identical retry could succeed, not whether a modified attempt would. Fixing inputs or permissions is a different decision.',
  ],
} satisfies RecipeMetadata;
