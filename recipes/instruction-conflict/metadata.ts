import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'instruction-conflict',
  title: 'Check instructions for conflict',
  description:
    'Decide whether two instructions can both be followed under the supplied circumstances.',
  category: 'workflow',
  tags: ['instructions', 'conflict', 'contradiction', 'requirements', 'rules', 'compatible'],
  useWhen: 'You need to detect conflicting instructions before carrying out a task.',
  related: [
    {
      id: 'instruction-fit',
      reason: 'Use instruction-fit to decide whether one instruction applies to a task.',
    },
    {
      id: 'answer-consistency',
      reason: 'Use answer-consistency to compare factual claims rather than required behavior.',
    },
  ],
  limitations: [
    'Assesses compatibility of supplied instructions only; does not establish their authority or choose which one wins.',
    'Does not enforce permissions or execute instructions. The caller resolves conflicts before acting.',
  ],
} satisfies RecipeMetadata;
