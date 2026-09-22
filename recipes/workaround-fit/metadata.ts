import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'workaround-fit',
  title: 'Check workaround fit',
  description: 'Can workaround address issue without violating constraints?',
  category: 'support',
  tags: ['support', 'workaround', 'fit'],
  limitations: [
    'Assesses described compatibility. It does not establish operational safety, execute a workaround, or grant access.',
  ],
} satisfies RecipeMetadata;
