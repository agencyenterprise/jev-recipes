import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'document-role',
  title: 'Identify document purpose',
  description: 'What is the primary purpose of document?',
  category: 'knowledge',
  tags: ['knowledge', 'document', 'role'],
  limitations: [
    'Returns one primary role from the supplied text. It does not read files, split mixed documents, or create an index.',
  ],
} satisfies RecipeMetadata;
