import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'buying-intent',
  title: 'Grade buying intent',
  description: 'How strong is the purchase intent expressed in message, on a five-level rubric?',
  category: 'conversation',
  tags: ['sales', 'crm', 'intent', 'lead', 'qualification'],
  useWhen:
    'You need to rank or route inbound leads and replies by how close the sender is to buying, not just whether they are interested.',
  related: [
    {
      id: 'turn-intent',
      reason:
        'Use turn-intent to classify the communicative purpose of a message outside a sales context.',
    },
    {
      id: 'commitment-strength',
      reason: 'Use commitment-strength to grade how firmly a message commits to a stated action.',
    },
  ],
  limitations: [
    'Grades expressed intent only. It does not estimate budget, authority, or whether the deal will close.',
    'The score is an expected value over rubric levels. Application code chooses routing cutoffs.',
  ],
} satisfies RecipeMetadata;
