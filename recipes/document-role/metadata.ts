import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'document-role',
  title: 'Identify document purpose',
  description: 'What is the primary purpose of document?',
  category: 'knowledge',
  tags: ['knowledge', 'document', 'role'],
  useWhen: 'You need to identify the primary purpose of a document.',
  related: [
    {
      id: 'context-role',
      reason: 'Use context-role to assess how a passage relates to a specific question.',
    },
  ],
  limitations: [
    'Returns one primary role from the supplied text. It does not read files, split mixed documents, or create an index.',
  ],
} satisfies RecipeMetadata;
