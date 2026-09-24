import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'defect-report-facets',
  title: 'Label the facets of a defect report',
  description:
    'Which of these does report state: the part or lot identifier, a description of the defect, where it was detected, the quantity affected, a containment action?',
  category: 'workflow',
  tags: ['manufacturing', 'quality', 'defect', 'nonconformance', 'labels', 'multi-label'],
  useWhen:
    'You need to check an incoming nonconformance or defect report for the facts a quality process expects before it is accepted, or to tell the reporter which facts are missing.',
  related: [
    {
      id: 'bug-report-completeness',
      reason:
        'Use bug-report-completeness for software bug reports, where the expected parts are reproduction steps, expected and actual behavior, and environment.',
    },
    {
      id: 'clarify',
      reason:
        'Use clarify to phrase the follow-up question once a report is known to be missing a facet.',
    },
  ],
  limitations: [
    'Labels are independent, so a report can carry several or none.',
    'Detects that a fact is stated, not that it is correct. A part number can be mistyped and a stated quantity can be wrong.',
    'Does not check the report against part masters, lot records, or your nonconformance form. Validate identifiers and quantities in application code.',
  ],
} satisfies RecipeMetadata;
