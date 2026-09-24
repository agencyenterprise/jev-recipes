import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'expense-category',
  title: 'Match an expense to a category list',
  description:
    "Does expense clearly fall under one of the caller's categories, under several equally, under none, or is it unclear?",
  category: 'knowledge',
  tags: ['expenses', 'accounting', 'categorization', 'finance', 'routing'],
  useWhen:
    'You need to know whether a described expense can be filed under one of your own category definitions before an agent picks the category or asks the submitter for more detail.',
  related: [
    {
      id: 'route',
      reason:
        'Use route to pick one destination from a fixed list of routes rather than to check whether a category list covers an expense at all.',
    },
    {
      id: 'field-select',
      reason:
        'Use field-select to choose which field of a record holds a value, rather than which category definition a described purchase satisfies.',
    },
  ],
  limitations: [
    'Reports which situation holds (matched, multiple, none, unclear), not the name of the matched category. Extract the category name in a follow-up step once the result is matched.',
    "Judges the expense description against the category definitions as written. It does not know the caller's chart of accounts, tax treatment, or which category is preferred when definitions overlap.",
    'Amounts, dates, and receipt validity are not considered and must be checked in code.',
  ],
} satisfies RecipeMetadata;
