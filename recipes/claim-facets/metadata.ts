import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'claim-facets',
  title: 'Label the facets an insurance claim narrative states',
  description:
    'Which of these does claim state: when the incident happened, where it happened, what caused it, what was damaged or lost, and whether there are witnesses or evidence?',
  category: 'support',
  tags: [
    'insurance',
    'claims',
    'intake',
    'first-notice-of-loss',
    'labels',
    'multi-label',
    'facets',
  ],
  useWhen:
    'A claims intake assistant receives a free-form loss description and needs to know which standard first-notice details are already present so it can pre-fill the claim and ask only for what is missing.',
  related: [
    {
      id: 'symptom-facets',
      reason:
        "Use symptom-facets for the parallel intake check on a patient's symptom description rather than an insurance loss narrative.",
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to decide whether to ask the claimant a follow-up question about the facets this recipe finds missing.',
    },
  ],
  limitations: [
    'Reports only whether the wording states each facet, not whether the details are true, covered, or plausible. It makes no coverage, liability, or fraud judgment.',
    'Labels are independent, so a narrative can state several facets or none. Parse actual dates, addresses, and amounts in application code.',
  ],
} satisfies RecipeMetadata;
