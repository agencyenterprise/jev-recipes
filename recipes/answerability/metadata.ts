import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answerability',
  title: 'Check answerability',
  description: 'Decide whether supplied evidence can answer an entire question.',
  category: 'retrieval',
  tags: ['rag', 'abstention', 'evidence'],
  limitations: [
    'Does not generate an answer or establish source truth.',
    'Provide 1 to 50 evidence passages with unique IDs; handle empty retrieval in application code.',
  ],
} satisfies RecipeMetadata;
