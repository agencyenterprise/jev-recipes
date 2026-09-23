import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'issue-recurrence',
  title: 'Check whether an issue returned',
  description:
    'Label a reported issue as new, ongoing without resolution, or returned after reported recovery.',
  category: 'support',
  tags: [
    'support',
    'issue came back',
    'recurring issue',
    'reopened ticket',
    'never fixed',
    'reported recovery',
  ],
  useWhen:
    'You need to distinguish a new problem, one that never stopped, and an issue that came back after recovery.',
  related: [
    {
      id: 'resolution-check',
      reason: 'Use resolution-check to check whether the current message reports resolution.',
    },
    {
      id: 'ticket-match',
      reason: 'Use ticket-match to compare whether two reports concern the same underlying issue.',
    },
    {
      id: 'repeated-attempt',
      reason:
        'Use repeated-attempt to check whether a proposed troubleshooting step repeats an earlier attempt.',
    },
  ],
  limitations: [
    'Classifies the supplied customer reports; it does not verify system health or prove a common root cause.',
    'Missing history does not mean new, and a ticket closure or attempted fix does not prove recovery.',
    'Callers supply chronology and issue identity; the recipe does not fetch history or update tickets.',
  ],
} satisfies RecipeMetadata;
