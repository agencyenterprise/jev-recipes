import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'move-explanation-fit',
  title: 'Check move explanation fit',
  description:
    'Does explanation give a reason for move that is consistent with the described game state?',
  category: 'workflow',
  tags: ['game', 'explanation', 'consistency', 'agent', 'reasoning', 'gate'],
  useWhen:
    'An agent or player justifies a move in text and you want to catch explanations that cite pieces, threats, or resources the state does not contain.',
  related: [
    {
      id: 'game-action',
      reason:
        'Use game-action to have Jev choose a move from JSON game state and available actions.',
    },
    {
      id: 'causal-attribution',
      reason:
        'Use causal-attribution to judge whether a stated cause is supported by the described outcome outside a game context.',
    },
  ],
  limitations: [
    "Judges consistency of the explanation's wording with the described state, not whether the move is strong or the best available.",
    'Relies on the state description as written; it cannot detect a state description that is itself wrong. Exact position validation belongs in game code.',
  ],
} satisfies RecipeMetadata;
