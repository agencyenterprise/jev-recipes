import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'message-facets',
  title: 'Label the facets of a message',
  description:
    'Which of these does message do: ask a question, report a problem, request an action, state a deadline, reference prior contact?',
  category: 'support',
  tags: ['support', 'triage', 'labels', 'multi-label', 'intake', 'facets'],
  useWhen:
    'You need several independent yes/no labels on an incoming message in one call, for triage rules or form pre-fill.',
  related: [
    {
      id: 'turn-intent',
      reason: 'Use turn-intent when you need the single primary purpose of a message.',
    },
    {
      id: 'urgency-signal',
      reason: 'Use urgency-signal to detect an explicit request for urgent attention.',
    },
  ],
  limitations: [
    'Labels are independent, so a message can carry several or none.',
    'Deadline detection reports that a deadline is stated. Parse the actual date in code.',
  ],
} satisfies RecipeMetadata;
