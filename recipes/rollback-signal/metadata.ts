import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'rollback-signal',
  title: 'Check whether symptoms implicate a recent change',
  description:
    'Do symptoms plausibly point at the recently deployed change as the cause, judged on the timing and scope each describes?',
  category: 'workflow',
  tags: ['incident-response', 'rollback', 'deployment', 'on-call', 'devops', 'gate'],
  useWhen:
    'An incident is open shortly after a deploy and you need a fast read on whether the change is a plausible cause, to decide whether to propose a rollback or keep looking elsewhere.',
  related: [
    {
      id: 'causal-attribution',
      reason:
        'Use causal-attribution to classify how a text attributes a cause in general, rather than to check whether a specific change fits an incident.',
    },
    {
      id: 'change-risk',
      reason:
        'Use change-risk before deploying to grade how likely a change is to cause trouble, rather than after the fact to check whether it did.',
    },
  ],
  limitations: [
    'Judges plausibility from the two descriptions, not root cause. A plausible match can still be a coincidence.',
    'Does not compare timestamps arithmetically or read diffs. Compute deploy-to-onset gaps in application code and pass them in the text.',
    'A negative verdict does not clear the change; it means the described timing and scope do not line up.',
  ],
} satisfies RecipeMetadata;
