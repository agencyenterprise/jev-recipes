import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'verify',
  title: 'Verify claims',
  description: 'Check each supplied claim against its paired evidence.',
  category: 'retrieval',
  tags: ['rag', 'grounding', 'claims'],
  limitations: [
    'Checks only supplied claims; does not establish source truth or completeness.',
    'Provide 1 to 100 claims with unique IDs.',
  ],
} satisfies RecipeMetadata;
