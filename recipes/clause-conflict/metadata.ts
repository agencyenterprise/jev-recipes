import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'clause-conflict',
  title: 'Detect conflicting clauses',
  description: 'Do firstClause and secondClause impose requirements that cannot both be satisfied?',
  category: 'knowledge',
  tags: ['contracts', 'legal', 'conflict', 'consistency', 'compliance'],
  useWhen:
    'You need a yes/no check that two clauses from a contract, policy set, or amendment can both be honored before flagging them for review.',
  related: [
    {
      id: 'instruction-conflict',
      reason:
        'Use instruction-conflict to compare two operational instructions rather than contract or policy clauses, with a separate different-scope outcome.',
    },
    {
      id: 'evidence-conflict',
      reason:
        'Use evidence-conflict to check whether two factual statements contradict each other rather than whether two requirements can both be met.',
    },
  ],
  limitations: [
    'Judges whether both clauses can be satisfied as written. It is not legal advice and does not decide which clause prevails, whether a precedence rule applies, or how a court would read them.',
    'Compares two clauses in isolation. Definitions or exceptions elsewhere in the document are unknown unless included in the clause text.',
  ],
} satisfies RecipeMetadata;
