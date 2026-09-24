import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'funder-fit',
  title: 'Compare two funding opportunities for a program',
  description:
    'Which of firstOpportunity and secondOpportunity better fits program in purpose, eligibility wording, and scope?',
  category: 'knowledge',
  tags: ['nonprofit', 'grants', 'fundraising', 'prospecting', 'comparison', 'eligibility'],
  useWhen:
    'You are shortlisting funding opportunities for a described program and want a head-to-head read on which of two calls fits it better before a development officer reads the full guidelines.',
  related: [
    {
      id: 'listing-compare',
      reason:
        'Use listing-compare for the same pairwise judgment over product listings and a shopper request.',
    },
    {
      id: 'passage-compare',
      reason:
        'Use passage-compare for the same pairwise judgment over text passages and a question.',
    },
  ],
  limitations: [
    'Compares the opportunity descriptions as written against the program as described. It does not know deadlines, past awards, or eligibility facts that are not in the text.',
    'Fit is not likelihood of award. Competitiveness, relationships, and funder priorities outside the text are not judged.',
    'Amount ranges are read as stated; comparing a budget figure to a range and computing dates belong in application code.',
  ],
} satisfies RecipeMetadata;
