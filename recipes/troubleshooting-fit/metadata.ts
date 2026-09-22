import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'troubleshooting-fit',
  title: 'Check troubleshooting applicability',
  description: 'Does procedure address symptoms under the described circumstances?',
  category: 'support',
  tags: ['support', 'troubleshooting', 'fit'],
  useWhen: 'You need to choose whether a procedure fits the reported symptoms and circumstances.',
  related: [
    {
      id: 'attempted-step',
      reason: 'Use attempted-step to check whether that procedure has already been tried.',
    },
  ],
  limitations: [
    'Assesses a supplied procedure; it does not diagnose a root cause, generate steps, or execute them.',
  ],
} satisfies RecipeMetadata;
