import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'retrieval-needed',
  title: 'Check whether retrieval is needed',
  description: 'Does request require facts beyond context?',
  category: 'retrieval',
  tags: ['retrieval', 'needed', 'rag', 'evidence'],
  useWhen: 'You need to decide whether answering requires facts beyond the current context.',
  related: [
    {
      id: 'freshness-needed',
      reason: 'Use freshness-needed to check whether those facts must be current.',
    },
  ],
  limitations: [
    'Assesses information needs without searching. A no-retrieval decision does not establish source truth.',
  ],
} satisfies RecipeMetadata;
