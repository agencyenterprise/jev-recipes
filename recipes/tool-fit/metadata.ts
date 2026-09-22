import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'tool-fit',
  title: 'Check a tool fit',
  description: 'Can the capabilities explicitly described in tool perform task?',
  category: 'workflow',
  tags: ['workflow', 'tool', 'fit'],
  useWhen: 'You need to check whether a tool has the stated capability to perform a task.',
  related: [
    {
      id: 'argument-fit',
      reason: 'Use argument-fit to validate the meaning of a proposed tool argument.',
    },
  ],
  limitations: [
    'Assesses a supplied capability description. It does not discover tools, validate credentials, or grant permission.',
  ],
} satisfies RecipeMetadata;
