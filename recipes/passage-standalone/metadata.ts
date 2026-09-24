import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'passage-standalone',
  title: 'Check passage self-containment',
  description:
    'Can passage be understood on its own, without unresolved references to surrounding text?',
  category: 'retrieval',
  tags: ['chunking', 'retrieval', 'embedding', 'context', 'passage'],
  useWhen:
    'You need to check chunks before embedding them, or decide whether a retrieved passage needs its neighbors to be useful.',
  related: [
    {
      id: 'context-role',
      reason:
        'Use context-role to decide what part a passage plays in answering a specific question.',
    },
    {
      id: 'query-specificity',
      reason:
        'Use query-specificity to check the other side of retrieval: whether the query is clear enough to match.',
    },
  ],
  limitations: [
    'Judges whether the passage is self-contained, not whether it is accurate, relevant, or well chunked.',
    'Does not say which references are unresolved or rewrite the passage. Repair and re-chunking belong in application code.',
  ],
} satisfies RecipeMetadata;
