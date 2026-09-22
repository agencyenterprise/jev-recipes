import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'query-specificity',
  title: 'Check question specificity',
  description: 'Does question, interpreted with context, identify a focused information need?',
  category: 'retrieval',
  tags: ['retrieval', 'query', 'specificity', 'rag', 'evidence'],
  useWhen: 'You need to know whether a question identifies a focused information need.',
  related: [
    {
      id: 'clarify',
      reason: 'Use clarify to check named requirements for missing or ambiguous information.',
    },
  ],
  limitations: [
    'Assesses focus only. Use clarify when the application has explicit required fields to check.',
  ],
} satisfies RecipeMetadata;
