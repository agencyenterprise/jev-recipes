import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'budget-narrative-fit',
  title: 'Check a budget narrative against its line items',
  description:
    'Does narrative explain each line item in lineItems and nothing that lineItems does not list?',
  category: 'knowledge',
  tags: ['nonprofit', 'grants', 'budget', 'proposal', 'gate', 'review'],
  useWhen:
    'You review grant budgets before submission and want to catch a narrative that skips a line item or justifies an expense the budget table does not contain.',
  related: [
    {
      id: 'summary-coverage',
      reason:
        'Use summary-coverage to check that a summary preserves each supplied source point in one direction, rather than two-way alignment between a table and its narrative.',
    },
    {
      id: 'commit-message-fit',
      reason:
        'Use commit-message-fit for the analogous check that a commit message describes the change it accompanies.',
    },
  ],
  limitations: [
    'Judges coverage in both directions, not arithmetic. Whether narrative amounts match the table or sum to the total is checked in application code.',
    "Does not judge whether costs are reasonable, allowable, or within a funder's rules.",
    'A misaligned verdict says the two texts do not cover the same items; it does not say which side is wrong.',
  ],
} satisfies RecipeMetadata;
