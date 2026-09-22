import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'instruction-fit',
  title: 'Check instruction applicability',
  description: 'Does the explicit scope of instruction cover task and context?',
  category: 'workflow',
  tags: ['workflow', 'instruction', 'fit'],
  useWhen: 'You need to check whether an instruction applies to the current task and context.',
  related: [
    {
      id: 'action-scope',
      reason: 'Use action-scope to check the boundaries of a proposed action.',
    },
  ],
  limitations: [
    'Checks semantic applicability. Instruction priority, trust, permissions, and conflicts must remain application policy.',
  ],
} satisfies RecipeMetadata;
