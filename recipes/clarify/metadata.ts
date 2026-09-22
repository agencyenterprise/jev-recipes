import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'clarify',
  title: 'Check required information',
  description: 'Identify missing or ambiguous information before proceeding.',
  category: 'conversation',
  tags: ['requirements', 'ambiguity', 'clarification'],
  useWhen: 'You need to check for missing or ambiguous requirements before proceeding.',
  related: [
    {
      id: 'query-specificity',
      reason:
        'Use query-specificity to assess how focused the question is, without a requirements list.',
    },
  ],
  limitations: [
    'Checks only the requirements you supply; does not generate follow-up questions.',
    'Provide 1 to 50 requirements with unique IDs.',
  ],
} satisfies RecipeMetadata;
