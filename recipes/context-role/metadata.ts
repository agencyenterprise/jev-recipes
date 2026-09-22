import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'context-role',
  title: 'Identify a passage role',
  description: 'What role does passage play in answering question?',
  category: 'retrieval',
  tags: ['retrieval', 'context', 'role', 'rag', 'evidence'],
  useWhen: 'You want to identify the role a passage plays in answering a question.',
  related: [{ id: 'rerank', reason: 'Use rerank to select and order passages by relevance.' }],
  limitations: [
    'Classifies a passage contribution. It does not rank sources or prove the answer is supported.',
  ],
} satisfies RecipeMetadata;
