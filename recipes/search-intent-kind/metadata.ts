import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'search-intent-kind',
  title: 'Classify search intent',
  description:
    'What is the searcher behind query trying to do: learn, reach a site, buy, compare before buying, or find something nearby?',
  category: 'knowledge',
  tags: ['search', 'seo', 'intent', 'query', 'content', 'classification'],
  useWhen:
    'You map keywords to page types, route queries to different result layouts, or audit whether content matches the intent behind the terms it targets.',
  related: [
    {
      id: 'turn-intent',
      reason:
        'Use turn-intent to classify what a user wants from a single message in a conversation.',
    },
    {
      id: 'query-specificity',
      reason:
        'Use query-specificity to judge how narrow or broad a query is rather than what the searcher wants to do.',
    },
  ],
  limitations: [
    'Classifies from the wording of the query alone; it does not see search history, location, or result pages.',
    'Short or ambiguous queries often carry several intents. Treat the probabilities, not only the verdict, as the signal.',
  ],
} satisfies RecipeMetadata;
