import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'listener-request-kind',
  title: "Classify a listener's request",
  description: "What does a listener's message ask of the performance?",
  category: 'conversation',
  tags: ['music', 'live-performance', 'chat', 'intent', 'classification', 'conversation'],
  useWhen:
    'Chat messages steer a live or generated musical performance and you need to know which control each message reaches for before deciding what to change.',
  related: [
    {
      id: 'turn-intent',
      reason:
        'Use turn-intent for the general communicative purpose of a message rather than which aspect of a performance it asks to change.',
    },
    {
      id: 'route',
      reason:
        'Use route when the destinations are caller-defined handlers rather than this fixed set of performance controls.',
    },
  ],
  limitations: [
    'Classifies what the message asks for, not whether the performer should comply or whether the request is feasible.',
    'A message that asks for several things is classified by the request it presses most; split multi-part messages in code when each matters.',
    'Chatter, reactions, and questions that ask nothing of the performance land on unclear rather than being guessed into a control.',
  ],
} satisfies RecipeMetadata;
