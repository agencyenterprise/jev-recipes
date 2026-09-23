import type { RecipeMetadata } from '../../src/schema.js';

export const metadata = {
  id: 'checkers-move',
  title: 'Choose a checkers move',
  description:
    'Recommend a supplied legal checkers move from a structured board and player, with built-in American/English checkers instructions.',
  category: 'workflow',
  tags: ['checkers', 'draughts', 'gameplay', 'board game', 'legal moves', 'kings', 'captures'],
  useWhen:
    'Your checkers game already provides its board, acting player, and legal moves, and you want a move ID without writing decision prompts.',
  related: [
    {
      id: 'choose-action',
      reason:
        'Use choose-action for other games, checkers variants, or custom objectives. It accepts your rules and action descriptions instead of translating a checkers board.',
    },
    {
      id: 'take-turn',
      reason:
        'Use take-turn for narrative turn eligibility. Checkers games should supply the known acting player directly without another model call.',
    },
  ],
  limitations: [
    'Supports the documented 8x8 American/English variant and orientation. Your game supplies complete legal moves and owns turn, draw, and execution rules.',
    'Validates format, ownership, and capture references; does not generate moves, prove legality, search future positions, or guarantee optimal play.',
    'Makes one logical Jev request. Tests and demos are offline; live latency and playing strength have not been measured.',
  ],
} satisfies RecipeMetadata;
