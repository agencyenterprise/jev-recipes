import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'mood-request',
  title: 'Identify a requested mood',
  description: "What mood does the listener's message ask to hear?",
  category: 'conversation',
  tags: ['music', 'psychology', 'mood', 'live-performance', 'chat', 'conversation'],
  useWhen:
    "A listener's message asks for a feeling from a musical performance and you need one of a fixed set of moods to steer the next passage.",
  related: [
    {
      id: 'emotion-kind',
      reason:
        'Use emotion-kind to label the emotion the writer expresses, rather than the mood they ask the music to take on.',
    },
    {
      id: 'turn-intent',
      reason:
        'Use turn-intent to find out what a message is doing conversationally before asking which mood it requests.',
    },
  ],
  limitations: [
    'Labels the mood the message asks for, not the mood the listener is in. A listener who says they are sad may be asking for cheerful music.',
    'Messages that ask for a tempo, style, or piece without naming a feeling land on unclear rather than being translated into a mood.',
    'Mixed or contradictory requests collapse to the mood pressed most or to unclear; the recipe returns one label.',
  ],
} satisfies RecipeMetadata;
