import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'tool-fit',
  title: 'Check a tool fit',
  description: 'Can the capabilities explicitly described in tool perform task?',
  category: 'workflow',
  tags: ['workflow', 'tool', 'fit'],
  limitations: [
    'Assesses a supplied capability description. It does not discover tools, validate credentials, or grant permission.',
  ],
} satisfies RecipeMetadata;
