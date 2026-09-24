import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'game-phase',
  title: 'Classify game phase',
  description:
    'Which phase of the game does state describe: opening, midgame, endgame, or game over?',
  category: 'workflow',
  tags: ['game', 'phase', 'state', 'agent', 'classification', 'simulation'],
  useWhen:
    'An agent adapts its strategy, prompts, or time budget by game phase and you have a textual state description rather than a structured engine.',
  related: [
    {
      id: 'game-action',
      reason: 'Use game-action to choose a move from JSON game state and available actions.',
    },
    {
      id: 'step-progress',
      reason: 'Use step-progress to judge how far a non-game task has advanced.',
    },
  ],
  limitations: [
    'Classifies from the textual state description; it does not simulate the game. Compute exact win, loss, and draw conditions in code.',
    'Phase boundaries are fuzzy in many games. Use the probabilities when opening and midgame or midgame and endgame are both plausible.',
  ],
} satisfies RecipeMetadata;
