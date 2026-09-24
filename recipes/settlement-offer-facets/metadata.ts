import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'settlement-offer-facets',
  title: 'Label the facets a settlement offer letter states',
  description:
    'Which of these does offer state: the settlement amount, the basis for that amount, a deadline to respond, release terms, and how to dispute or appeal?',
  category: 'knowledge',
  tags: ['insurance', 'claims', 'settlement', 'letter', 'labels', 'multi-label', 'facets'],
  useWhen:
    'A claims quality or consumer-advocacy tool reviews settlement offer letters and needs to know which standard elements each letter contains before checking it against a policy or template.',
  related: [
    {
      id: 'invoice-facets',
      reason:
        'Use invoice-facets for the parallel completeness check on an invoice rather than a settlement offer letter.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to decide whether to ask the sender for the elements this recipe finds missing.',
    },
  ],
  limitations: [
    'Reports only whether the wording states each element, not whether the amount is fair, the basis is correct, the deadline is lawful, or the release is enforceable. It makes no legal determination.',
    'Labels are independent, so a letter can state several elements or none. Parse actual amounts, dates, and deadlines in application code.',
  ],
} satisfies RecipeMetadata;
