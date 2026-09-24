import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'fair-housing-wording',
  title: 'Flag applicant-preference wording in a listing',
  description:
    'Does listing express a preference for, or limitation on, applicants based on personal characteristics rather than describing the property?',
  category: 'conversation',
  tags: ['real-estate', 'fair-housing', 'listings', 'compliance', 'gate', 'wording'],
  useWhen:
    'You need to screen rental or sale listings before publication for wording that steers, prefers, or excludes people by family status, religion, national origin, disability, or similar characteristics, so a human reviewer can look at the flagged ones.',
  related: [
    {
      id: 'question-relevance',
      reason:
        'Use question-relevance to check whether a screening question asked of an applicant is pertinent, rather than whether listing copy itself expresses a preference.',
    },
    {
      id: 'policy-severity',
      reason:
        'Use policy-severity to grade how serious a confirmed violation is against a supplied policy, rather than to detect the wording in the first place.',
    },
  ],
  limitations: [
    'Judges wording only. Whether a phrase is unlawful depends on jurisdiction, exemptions, and context, so legal determinations belong to counsel and jurisdiction rules in application code.',
    'Flags statements about who should apply or live there, not neutral descriptions of the property, neighborhood, or nearby institutions.',
    'Does not detect discrimination that happens outside the listing text, such as in replies to inquiries or showing decisions.',
  ],
} satisfies RecipeMetadata;
