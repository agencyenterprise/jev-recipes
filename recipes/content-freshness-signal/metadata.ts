import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'content-freshness-signal',
  title: 'Detect perishable content',
  description:
    'Does content contain claims that are likely to go stale, such as prices, versions, dates, current events, or latest wording?',
  category: 'knowledge',
  tags: ['content', 'seo', 'freshness', 'maintenance', 'evergreen', 'gate'],
  useWhen:
    'You schedule content reviews, decide which pages need dated review notes, or want to flag articles that will silently become wrong.',
  related: [
    {
      id: 'fact-stability',
      reason:
        'Use fact-stability to judge a single stored fact rather than a whole piece of content.',
    },
    {
      id: 'freshness-needed',
      reason:
        'Use freshness-needed to decide whether a question requires current information to answer.',
    },
  ],
  limitations: [
    'Flags the presence of perishable claims; it does not say whether they are currently accurate or when they will expire.',
    "Does not know today's date. Review schedules and expiry calculations belong in code.",
  ],
} satisfies RecipeMetadata;
