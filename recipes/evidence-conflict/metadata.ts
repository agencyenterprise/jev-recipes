import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'evidence-conflict',
  title: 'Compare evidence for conflicts',
  description:
    'Do firstPassage and secondPassage give incompatible evidence relevant to question under the same conditions?',
  category: 'retrieval',
  tags: ['retrieval', 'evidence', 'conflict', 'rag'],
  useWhen: 'You have two passages and need to check for conflicting evidence about a question.',
  related: [
    {
      id: 'answer-consistency',
      reason: 'Use answer-consistency to compare two statements directly.',
    },
  ],
  limitations: [
    'Does not decide which source is authoritative. Exact numbers, timestamps, and version ordering should be compared in code.',
  ],
} satisfies RecipeMetadata;
