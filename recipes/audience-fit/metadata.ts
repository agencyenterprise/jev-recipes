import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'audience-fit',
  title: 'Check audience fit',
  description:
    'Does the level of explanation in document fit the knowledge and needs explicitly described in audience?',
  category: 'knowledge',
  tags: ['knowledge', 'audience', 'fit'],
  limitations: [
    'Uses only the supplied audience description. It does not infer ability from identity or rewrite the document.',
  ],
} satisfies RecipeMetadata;
