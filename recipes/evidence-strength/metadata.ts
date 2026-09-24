import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'evidence-strength',
  title: 'Grade evidence strength',
  description: 'How strongly does evidence support the entire claim, on a five-level rubric?',
  category: 'retrieval',
  tags: ['evidence', 'strength', 'grading', 'rubric', 'score'],
  useWhen:
    'You need a graded strength for weighting or ranking evidence, not just a supported or unsupported label.',
  related: [
    {
      id: 'verify',
      reason:
        'Use verify for a categorical supported, contradicted, or unsupported verdict per claim.',
    },
    {
      id: 'answerability',
      reason: 'Use answerability to decide whether evidence can answer a whole question.',
    },
  ],
  limitations: [
    'Grades support only. Contradiction lands at the lowest level; use verify to distinguish it.',
    'The score is an expected value over rubric levels. Application code chooses cutoffs.',
  ],
} satisfies RecipeMetadata;
