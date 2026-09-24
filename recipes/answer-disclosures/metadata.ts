import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'answer-disclosures',
  title: 'Label the disclosures in an answer',
  description:
    'Which of these does draft include: stated uncertainty, stated limitations, cited sources, stated assumptions?',
  category: 'answer-quality',
  tags: ['answer-quality', 'disclosure', 'labels', 'multi-label', 'transparency', 'evaluation'],
  useWhen:
    'You need to audit or gate model answers on transparency habits in a single call, for evaluation sets or response policies.',
  related: [
    {
      id: 'uncertainty-expression',
      reason: 'Use uncertainty-expression to grade how certain a single claim sounds.',
    },
    {
      id: 'citation-needed',
      reason:
        'Use citation-needed to decide whether a statement requires evidence under your rules.',
    },
  ],
  limitations: [
    'Detects that a disclosure is present, not that it is accurate or sufficient.',
    'A cited source is detected by attribution wording. Verify the source exists in code.',
  ],
} satisfies RecipeMetadata;
