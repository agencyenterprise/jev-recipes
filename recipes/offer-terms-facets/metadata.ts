import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'offer-terms-facets',
  title: 'Label what a property offer states',
  description:
    'Which of these does offer state: a price, financing, contingencies, a closing or move-in date, an earnest money or security deposit?',
  category: 'knowledge',
  tags: ['real-estate', 'offers', 'leasing', 'labels', 'multi-label', 'transactions'],
  useWhen:
    'You need several independent presence checks on a purchase or lease offer in one call, to spot missing terms before it is countersigned, countered, or entered into a transaction system.',
  related: [
    {
      id: 'clarify',
      reason:
        "Use clarify to decide whether a buyer's or tenant's request is too ambiguous to act on, rather than which terms a written offer states.",
    },
    {
      id: 'invoice-facets',
      reason:
        'Use invoice-facets for the same presence-check pattern over invoice text instead of offer terms.',
    },
  ],
  limitations: [
    'Each label reports whether the offer text states the term, not whether the stated value is reasonable, complete, or acceptable.',
    'Amounts, percentages, and dates are not validated or compared to a listing. Parse and check them in code.',
    'Labels are independent, so an offer can carry several, all, or none.',
  ],
} satisfies RecipeMetadata;
