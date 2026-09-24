import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'error-acknowledgment',
  title: 'Check whether a message acknowledges a mistake',
  description:
    'Does message explicitly acknowledge an earlier mistake and state a correction, rather than silently changing course or ignoring it?',
  category: 'conversation',
  tags: ['agent', 'self-monitoring', 'correction', 'honesty', 'conversation', 'gate'],
  useWhen:
    'An agent has been shown to be wrong earlier in a conversation and you want to verify that its follow-up owns the error and states the fix, rather than quietly switching answers.',
  related: [
    {
      id: 'correction-target',
      reason:
        'Use correction-target to identify which earlier statement a correction refers to, rather than whether the message acknowledges an error at all.',
    },
    {
      id: 'uncertainty-expression',
      reason:
        'Use uncertainty-expression to grade how the message hedges, rather than whether it admits a prior mistake.',
    },
  ],
  limitations: [
    'Judges the wording of message, not whether the earlier statement really was wrong or whether the stated correction is right.',
    'Without context, the recipe cannot tell whether an acknowledgment refers to a real earlier turn; it judges only that the message names a mistake and a correction.',
    'Does not judge tone. A curt acknowledgment passes, and an effusive apology with no stated correction fails.',
  ],
} satisfies RecipeMetadata;
