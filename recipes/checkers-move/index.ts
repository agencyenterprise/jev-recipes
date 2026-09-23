import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { checkersMoveInputSchema, checkersMoveResultSchema } from './schema.js';
import type { CheckersMoveInput, CheckersMoveResult } from './schema.js';

export async function checkersMove(
  input: CheckersMoveInput,
  options: RecipeOptions = {},
): Promise<CheckersMoveResult> {
  const { board, player, legalMoves, minConfidence = 0.8 } = checkersMoveInputSchema.parse(input);
  const pieces = new Map(board.map((piece) => [piece.square, piece]));
  const material = { you: { men: 0, kings: 0 }, opponent: { men: 0, kings: 0 } };
  const position = board.map((piece) => {
    const owner = piece.player === player ? 'you' : 'opponent';
    material[owner][piece.king ? 'kings' : 'men'] += 1;
    return `${piece.square}: ${owner === 'you' ? 'your' : 'opponent'} ${piece.king ? 'king' : 'man'}`;
  });
  const candidates = legalMoves.map((move) => {
    // References and nonempty paths are checked by the input schema.
    const piece = pieces.get(move.from)!;
    const captures = (move.captures ?? []).map(
      (square) => `opponent ${pieces.get(square)!.king ? 'king' : 'man'} at ${square}`,
    );
    const promotes = !piece.king && move.path.at(-1)!.endsWith(player === 'red' ? '8' : '1');
    return {
      id: move.id,
      text:
        `Move your ${piece.king ? 'king' : 'man'} from ${move.from} to ${move.path.join(' then ')}. ` +
        `Captures: ${captures.length ? captures.join(', ') : 'none'}.` +
        (promotes ? ' Promotes to king and ends the turn.' : ''),
    };
  });
  const decision = await selectCandidate(
    { player, board: position.join('\n'), material },
    candidates,
    'Choose the supplied move that best advances winning for player in American/English checkers on an 8x8 board. ' +
      'Coordinates are fixed: a1 is bottom left, a-h run left to right, ranks 1-8 run bottom to top. Only dark squares are playable. ' +
      'Red men move and capture toward rank 8; black men toward rank 1. Kings move one diagonal square or jump an adjacent opponent in either direction, not flying kings. ' +
      "Captures are compulsory; each candidate includes its complete jump sequence. Among capture alternatives, taking the most pieces is not compulsory. Reaching the promotion rank ends a man's turn. " +
      'The caller supplies the full current board and legal moves for the acting player. Unlisted squares are empty. Compare those candidates without inventing moves or reconstructing game history. ' +
      'Win by leaving the opponent without pieces or legal moves. Consider immediate wins, material including kings, vulnerability to replies, promotion, and mobility. More captures alone do not establish a better move. ' +
      'Use the supplied material counts; do not assume a draw history or hidden search results. Future uncertainty alone is not ambiguity, but an unresolved tie or insufficient facts to prefer one move requires ambiguous. ' +
      'Choose none only if no supplied candidate can be used because the supplied position and candidates conflict. Recommend a move without executing it or claiming optimal play.',
    minConfidence,
    options,
  );
  return checkersMoveResultSchema.parse(decision);
}

export { checkersMoveInputSchema, checkersMoveResultSchema } from './schema.js';
export type { CheckersMoveInput, CheckersMoveResult } from './schema.js';
