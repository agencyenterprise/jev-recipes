import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'choose-action',
  title: 'Choose a game action from supplied candidates',
  description:
    'Recommend one eligible game action against a supplied goal, using rules, current state, and optional player history.',
  category: 'workflow',
  tags: [
    'gameplay',
    'game',
    'choose action',
    'best move',
    'strategy',
    'players',
    'turn',
    'simulation',
  ],
  useWhen:
    'You need to choose the next game action from a list using the current environment, game rules, and previous player actions.',
  related: [
    {
      id: 'checkers-move',
      reason:
        'Use checkers-move for a structured American/English checkers board and legal moves, with built-in rules and move descriptions.',
    },
    {
      id: 'take-turn',
      reason:
        'Use take-turn to assess whether the player has an opportunity to act now before selecting an action.',
    },
    {
      id: 'tool-fit',
      reason:
        "Use tool-fit to check one tool's capability for a task; it does not compare game actions under a goal and game rules.",
    },
    {
      id: 'step-progress',
      reason:
        'Use step-progress to assess an observed outcome after a move; this recipe recommends a candidate before execution.',
    },
  ],
  limitations: [
    'Produces a model judgment, not a game solver, legality proof, or guarantee of optimal play. Use an authoritative game engine for exact legality checks.',
    'Uses only supplied player-visible information. It does not fetch state, simulate future turns, or execute the chosen action.',
    'History may be incomplete. Supply decision-critical facts in the current environment; ties or unresolved constraints require review.',
  ],
} satisfies RecipeMetadata;
