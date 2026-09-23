import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'game-action',
  title: 'Choose a game action from JSON',
  description:
    'Send game state, player state, and available actions as JSON; receive the original selected action with Jev confidence and probabilities.',
  category: 'workflow',
  tags: ['gameplay', 'game', 'agnostic', 'JSON', 'actions', 'automatic IDs', 'simulation'],
  useWhen:
    'Your game already supplies JSON state and actions, and you want Jev to choose an action without formatting descriptions or assigning IDs.',
  related: [
    {
      id: 'choose-action',
      reason:
        'Use choose-action for text-based rules and state, caller-named actions, and confidence-based review handling.',
    },
    {
      id: 'checkers-move',
      reason:
        'Use checkers-move for its American/English checkers board format and built-in checkers instructions.',
    },
  ],
  limitations: [
    'Confidence and probabilities describe the Jev decision, not a measured probability of winning.',
    'The full action list is sent in one logical request. Provider request limits still apply.',
    'Internal action labels belong to the current call; existing game IDs remain in the returned action.',
  ],
} satisfies RecipeMetadata;
