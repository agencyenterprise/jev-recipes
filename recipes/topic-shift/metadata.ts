import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'topic-shift',
  title: 'Detect a topic shift',
  description: 'Does message stay with currentTopic, introduce a different topic, or contain both?',
  category: 'conversation',
  tags: ['conversation', 'topic', 'shift'],
  limitations: [
    'Compares one message with a supplied topic. It does not generate topic labels or split conversation threads.',
  ],
} satisfies RecipeMetadata;
