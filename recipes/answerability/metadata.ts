import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answerability',
  title: 'Check answerability',
  description: 'Decide whether supplied evidence can answer an entire question.',
  category: 'retrieval',
  tags: ['rag', 'abstention', 'evidence'],
  useWhen: 'You need to know if you have enough evidence and can answer a question.',
  related: [
    {
      id: 'answer-coverage',
      reason: 'Use answer-coverage after drafting to check whether each question was addressed.',
    },
  ],
  limitations: [
    'Does not generate an answer or establish source truth.',
    'Provide 1 to 50 evidence passages with unique IDs; handle empty retrieval in application code.',
  ],
} satisfies RecipeMetadata;
