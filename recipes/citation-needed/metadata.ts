import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'citation-needed',
  title: 'Check citation requirements',
  description: 'Do citationRules require evidence for statement?',
  category: 'answer-quality',
  tags: ['answer-quality', 'citation', 'needed', 'rag', 'evidence'],
  useWhen: 'You need to decide whether a statement requires a citation under your rules.',
  related: [
    {
      id: 'citation-match',
      reason: 'Use citation-match to find supporting passages once a citation is needed.',
    },
  ],
  limitations: [
    'Assesses a supplied citation policy; does not find sources or determine whether a statement is true.',
  ],
} satisfies RecipeMetadata;
