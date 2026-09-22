import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'rerank',
  title: 'Rerank evidence',
  description: 'Select candidate passages by relevance to a query.',
  category: 'retrieval',
  tags: ['rag', 'search', 'relevance'],
  useWhen: 'You have retrieved passages and want the most relevant evidence for a question.',
  related: [
    {
      id: 'answerability',
      reason: 'Use answerability to check whether the selected evidence is enough to answer.',
    },
  ],
  limitations: [
    'Does not retrieve documents or establish source truth.',
    'Provide 1 to 100 items with unique IDs.',
  ],
} satisfies RecipeMetadata;
