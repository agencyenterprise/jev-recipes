import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'certainty-match',
  title: 'Check certainty wording',
  description: 'Does the certainty expressed in draft match assessment?',
  category: 'answer-quality',
  tags: ['answer-quality', 'certainty', 'match', 'rag', 'evidence', 'alignment-research'],
  useWhen: 'You want the wording of a draft to reflect the certainty of an assessment.',
  related: [
    { id: 'tone-check', reason: 'Use tone-check to evaluate other explicit writing criteria.' },
  ],
  limitations: [
    'Compares wording with a supplied assessment. It does not calibrate probabilities or establish the assessment itself.',
  ],
} satisfies RecipeMetadata;
