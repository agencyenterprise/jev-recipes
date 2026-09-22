import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'certainty-match',
  title: 'Check certainty wording',
  description: 'Does the certainty expressed in draft match assessment?',
  category: 'answer-quality',
  tags: ['answer-quality', 'certainty', 'match', 'rag', 'evidence'],
  limitations: [
    'Compares wording with a supplied assessment. It does not calibrate probabilities or establish the assessment itself.',
  ],
} satisfies RecipeMetadata;
