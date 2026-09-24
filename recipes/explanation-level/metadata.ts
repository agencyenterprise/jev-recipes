import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'explanation-level',
  title: 'Grade shown reasoning',
  description:
    'How much reasoning does answer show for its conclusion to question, on a five-level rubric from bare conclusion to rigorous chain?',
  category: 'answer-quality',
  tags: ['education', 'reasoning', 'explanation', 'assessment', 'score'],
  useWhen:
    'You assess whether students or assistants showed their work, separately from whether the final answer is right.',
  related: [
    {
      id: 'answer-relevance',
      reason: 'Use answer-relevance to check that the answer addresses the question at all.',
    },
    {
      id: 'certainty-match',
      reason:
        'Use certainty-match to check whether the confidence expressed fits the reasoning given.',
    },
  ],
  limitations: [
    'Grades the visible reasoning, not its correctness; a complete chain can rest on a false premise.',
    'Rewards shown steps, so a correct one-line answer to a trivial question grades bare.',
    'The score is an expected value over levels. Application code chooses cutoffs.',
  ],
} satisfies RecipeMetadata;
