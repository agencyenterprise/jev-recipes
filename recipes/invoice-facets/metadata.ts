import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'invoice-facets',
  title: 'Label what an invoice states',
  description:
    'Which of these does invoice state: vendor identity, an invoice number, a due date, line items, a tax or total breakdown?',
  category: 'knowledge',
  tags: ['invoices', 'accounting', 'accounts-payable', 'labels', 'multi-label', 'finance'],
  useWhen:
    'You need several independent presence checks on invoice text in one call, to spot missing fields before routing it for approval or entry.',
  related: [
    {
      id: 'clarify',
      reason:
        'Use clarify to decide whether a request about an invoice is too ambiguous to act on, rather than what the invoice text itself states.',
    },
    {
      id: 'field-select',
      reason:
        'Use field-select to pick which field of a record a value belongs to, rather than to check which fields the invoice text contains at all.',
    },
  ],
  limitations: [
    'Each label reports whether the invoice text states the item, not whether the stated value is correct, consistent, or matches a purchase order.',
    'Numbers, dates, and totals are not validated. Parse and check them in code.',
    'Labels are independent, so an invoice can carry several, all, or none.',
  ],
} satisfies RecipeMetadata;
