import { moveExplanationFit } from '../../recipes/move-explanation-fit/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  moveExplanationFit,
  {
    move: 'Knight from g1 to f3',
    explanation:
      "Developing the knight to f3 defends the pawn on e4 against the black knight's threat and prepares to castle kingside.",
    state:
      'Chess, White to move. White pieces: king e1, queen d1, rooks a1 and h1, bishops c1 and f1, knights b1 and g1, pawns a2 b2 c2 d2 e2 f2 g2 h2. Black pieces: king e8, queen d8, rooks a8 and h8, bishops c8 and f8, knights b8 and f6, pawns a7 b7 c7 d7 e7 f7 g7 h7. Move 2: Black has just played knight g8 to f6.',
  },
  ['consistent', 'inconsistent'],
);
