import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'policy-compliance',
  title: 'Check an expense against a written policy',
  description: 'Does expense, as described, comply with the written policy?',
  category: 'workflow',
  tags: ['expenses', 'policy', 'compliance', 'accounting', 'finance', 'gate'],
  useWhen:
    'You need a yes/no check on whether a described expense follows the rules in an expense policy before it is approved, flagged, or sent back to the submitter.',
  related: [
    {
      id: 'policy-severity',
      reason:
        'Use policy-severity to grade how serious a known violation is, rather than to decide whether the expense violates the policy at all.',
    },
    {
      id: 'action-scope',
      reason:
        "Use action-scope to check whether an agent's proposed action stays within its permitted scope, rather than whether a submitted expense follows a spending policy.",
    },
  ],
  limitations: [
    'Judges the described facts against the written rules. Amounts, per-diem limits, dates, and receipt thresholds must be compared in code; the recipe treats stated numbers as facts to match against the text, not as arithmetic to perform.',
    "A rule the policy does not mention is treated as permitting the expense. The recipe does not know the organization's unwritten norms or approval history.",
    'Compliance with the wording is not an approval decision or an enforcement outcome.',
  ],
} satisfies RecipeMetadata;
