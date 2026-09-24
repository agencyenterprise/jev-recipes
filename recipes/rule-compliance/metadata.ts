import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'rule-compliance',
  title: 'Check rule compliance',
  description: 'Is the described action permitted by the written rules?',
  category: 'workflow',
  tags: ['game', 'rules', 'legality', 'agent', 'compliance', 'gate'],
  useWhen:
    "An agent proposes a move or action in natural language and you want a quick check against the game's written rules before spending engine time or accepting it.",
  related: [
    {
      id: 'game-action',
      reason:
        'Use game-action to have Jev choose among actions your code has already generated as legal.',
    },
    {
      id: 'action-scope',
      reason:
        'Use action-scope to check whether an agent action stays within a granted permission rather than a game rule set.',
    },
  ],
  limitations: [
    'Judges a described action against written rules; it does not generate legal moves or verify board state. Exact legality belongs in game code.',
    'Only the supplied rules count. Unwritten conventions or rules omitted from the input cannot be applied.',
  ],
} satisfies RecipeMetadata;
