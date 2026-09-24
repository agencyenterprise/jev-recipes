import { gamePhase } from '../../recipes/game-phase/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  gamePhase,
  {
    state:
      'Chess. White: king g1, rook d1, pawns a2, f2, g2. Black: king g8, rook e8, pawns a7, h6. Move 52, White to move. No queens or minor pieces remain. Neither side is in check.',
  },
  ['opening', 'midgame', 'endgame', 'terminal', 'unclear'],
  ['rules'],
);
