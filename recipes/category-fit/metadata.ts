import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'category-fit',
  title: 'Check an item against its category',
  description: 'Does the product described by item belong under category as defined?',
  category: 'knowledge',
  tags: ['catalog', 'taxonomy', 'classification', 'e-commerce', 'data-quality'],
  useWhen:
    'You need to audit catalog placements or gate seller-submitted listings so items do not land in the wrong category.',
  related: [
    {
      id: 'document-role',
      reason:
        'Use document-role to classify what kind of document a text is rather than where a product belongs.',
    },
    {
      id: 'route',
      reason:
        'Use route to pick the best category from several candidates instead of checking one.',
    },
  ],
  limitations: [
    'Checks one item against one category definition. It does not say which category the item belongs in instead.',
    'The judgment depends on the supplied definition, so a vague category description yields vague results.',
  ],
} satisfies RecipeMetadata;
