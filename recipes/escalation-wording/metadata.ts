import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'escalation-wording',
  title: 'Check whether a message asks for escalation',
  description:
    'Does message explicitly ask for escalation to a higher tier, a manager, or on-call engineering?',
  category: 'support',
  tags: ['support', 'escalation', 'routing', 'gate', 'on-call', 'customer-service'],
  useWhen:
    'You are routing inbound support messages or internal chat and need to catch explicit escalation requests so they reach a supervisor, a higher support tier, or the on-call engineer.',
  related: [
    {
      id: 'urgency-signal',
      reason:
        'Use urgency-signal to grade how urgent a message sounds, whether or not it asks for escalation.',
    },
    {
      id: 'handoff',
      reason:
        'Use handoff to decide whether a conversation should move to a human at all, rather than whether the writer asked for a higher tier.',
    },
  ],
  limitations: [
    'Detects an explicit request, not a need. A frustrated message that deserves escalation but does not ask for it yields absent.',
    'Does not decide whether the request should be granted or who the right recipient is. Routing rules belong in application code.',
  ],
} satisfies RecipeMetadata;
