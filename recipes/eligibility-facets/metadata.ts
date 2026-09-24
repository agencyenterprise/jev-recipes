import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'eligibility-facets',
  title: 'Label what an applicant statement addresses',
  description:
    'Which of these does statement address: residency, income, household size, identity documents, prior benefits received?',
  category: 'workflow',
  tags: ['public-sector', 'benefits', 'eligibility', 'intake', 'labels', 'multi-label'],
  useWhen:
    "You need several independent checks on an applicant's free-text statement in one call, to see which eligibility topics it already covers and which a caseworker still needs to ask about.",
  related: [
    {
      id: 'job-post-facets',
      reason:
        'Use job-post-facets for the same coverage-check pattern over a job posting instead of a benefits application statement.',
    },
    {
      id: 'clarify',
      reason:
        "Use clarify to decide whether an applicant's question is too ambiguous to answer, rather than which eligibility topics their statement addresses.",
    },
  ],
  limitations: [
    'Each label reports whether the statement addresses the topic, not whether the applicant is eligible or whether what they say is true.',
    'Amounts, dates, and household counts are not validated against program rules or records. Apply eligibility rules in code.',
    'Labels are independent, so a statement can carry several, all, or none.',
  ],
} satisfies RecipeMetadata;
