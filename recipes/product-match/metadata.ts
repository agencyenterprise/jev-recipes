import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'product-match',
  title: 'Check a listing against a request',
  description:
    'Does listing describe a product that satisfies what request asks for, including stated must-have attributes?',
  category: 'knowledge',
  tags: ['e-commerce', 'catalog', 'search', 'matching', 'product'],
  useWhen:
    'You need a yes/no filter on search or recommendation results so shoppers only see listings that meet their stated requirements.',
  related: [
    {
      id: 'rerank',
      reason:
        'Use rerank to order many listings by relevance to one query rather than gate each one.',
    },
    {
      id: 'tool-fit',
      reason:
        'Use tool-fit for the analogous check of whether a tool satisfies a task description.',
    },
  ],
  limitations: [
    'Judges the listing text against the request text. It cannot verify stock, price accuracy, or attributes the listing omits.',
    'A listing silent on a required attribute is treated as mismatched, which favors precision over recall.',
  ],
} satisfies RecipeMetadata;
