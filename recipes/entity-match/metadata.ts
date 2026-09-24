import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'entity-match',
  title: 'Match records to one entity',
  description:
    'Do firstRecord and secondRecord describe the same real-world entity despite formatting, abbreviation, or partial fields?',
  category: 'knowledge',
  tags: ['deduplication', 'entity-resolution', 'records', 'data-quality', 'matching'],
  useWhen:
    'You need to decide whether two customer, vendor, product, or place records should be merged or linked.',
  related: [
    {
      id: 'ticket-match',
      reason: 'Use ticket-match to decide whether two support tickets report the same issue.',
    },
    {
      id: 'task-duplicate',
      reason: 'Use task-duplicate to catch a task that repeats one already on the list.',
    },
  ],
  limitations: [
    'Judges identity from the supplied fields only. It does not look records up or verify that either one is accurate.',
    'Merge, survivorship, and which fields win remain application rules.',
  ],
} satisfies RecipeMetadata;
