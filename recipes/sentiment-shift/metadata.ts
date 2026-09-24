import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'sentiment-shift',
  title: 'Compare sentiment across messages',
  description:
    'How does the sentiment expressed in laterMessage compare with earlierMessage from the same person?',
  category: 'support',
  tags: ['support', 'sentiment', 'trend', 'conversation', 'signal', 'escalation'],
  useWhen:
    "You need to know whether a customer's expressed sentiment moved during a conversation, for example after an agent reply or a handoff.",
  related: [
    {
      id: 'frustration-signal',
      reason: 'Use frustration-signal for a categorical read on frustration in a single message.',
    },
    {
      id: 'resolution-check',
      reason: 'Use resolution-check to decide whether the customer reported the issue resolved.',
    },
  ],
  limitations: [
    "Compares expressed wording in two messages, not the person's actual feelings or the state of their issue.",
    'A shift does not establish its cause. Pair the verdict with the intervening turns in application code.',
  ],
} satisfies RecipeMetadata;
