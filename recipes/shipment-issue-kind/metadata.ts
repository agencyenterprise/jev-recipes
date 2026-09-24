import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'shipment-issue-kind',
  title: 'Classify a reported shipping problem',
  description: 'What shipping problem does message report?',
  category: 'support',
  tags: ['logistics', 'shipping', 'support', 'classification', 'delivery'],
  useWhen:
    'You need to route delivery complaints to the right workflow, such as a carrier trace, a replacement, or an address correction, from the words the customer used.',
  related: [
    {
      id: 'failure-kind',
      reason:
        'Use failure-kind to classify why a technical operation failed rather than what went wrong with a physical delivery.',
    },
    {
      id: 'issue-impact',
      reason:
        'Use issue-impact to grade how badly the reported problem affects the customer rather than what kind of problem it is.',
    },
  ],
  limitations: [
    'Classifies what the customer reports, not what the carrier record shows. Verify against tracking data before issuing a refund or replacement.',
    'A message that reports several problems is graded by the main one; the remedy the customer asks for is not part of the decision.',
  ],
} satisfies RecipeMetadata;
