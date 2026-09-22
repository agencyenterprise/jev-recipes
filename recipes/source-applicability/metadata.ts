import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'source-applicability',
  title: 'Check source applicability',
  description: 'Does the scope described in passage apply to scenario?',
  category: 'retrieval',
  tags: ['retrieval', 'source', 'applicability', 'rag', 'evidence'],
  limitations: [
    'Assesses semantic scope. Enforce tenant, access, exact version, and region constraints in application code.',
  ],
} satisfies RecipeMetadata;
