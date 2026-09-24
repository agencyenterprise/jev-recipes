import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'clause-kind',
  title: 'Classify contract clause kind',
  description: 'What does clause primarily do?',
  category: 'knowledge',
  tags: ['contracts', 'legal', 'clause', 'classification', 'compliance'],
  useWhen:
    'You need to sort contract or policy clauses by what they do so obligations and prohibitions can be tracked separately from rights and definitions.',
  related: [
    {
      id: 'constraint-strength',
      reason:
        'Use constraint-strength to grade how binding a single stated constraint is rather than what kind of clause it is.',
    },
    {
      id: 'document-role',
      reason:
        'Use document-role to classify the purpose of a whole document rather than one clause.',
    },
  ],
  limitations: [
    'Classifies the operative effect of the clause as written. It is not legal advice and does not establish whether the clause is enforceable or which party it favors.',
    'A clause that mixes effects is graded by its primary one. Split compound clauses in code when each part matters.',
  ],
} satisfies RecipeMetadata;
