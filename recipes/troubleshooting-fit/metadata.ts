import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'troubleshooting-fit',
  title: 'Check troubleshooting applicability',
  description: 'Does procedure address symptoms under the described circumstances?',
  category: 'support',
  tags: ['support', 'troubleshooting', 'fit'],
  limitations: [
    'Assesses a supplied procedure; it does not diagnose a root cause, generate steps, or execute them.',
  ],
} satisfies RecipeMetadata;
