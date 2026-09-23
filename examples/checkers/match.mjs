import { applyMove, legalMoves, otherPlayer, startingBoard } from './game.mjs';

// Array order is irrelevant; the side to move and king status are part of a position.
export const positionKey = (board, player) =>
  `${player}:${board
    .map((piece) => `${piece.square}/${piece.player}/${Boolean(piece.king)}`)
    .sort()
    .join(',')}`;

export class CheckersMatch {
  constructor({ board = startingBoard, player = 'red', moveLimit = 300 } = {}) {
    this.board = structuredClone(board);
    this.player = player;
    this.moveLimit = moveLimit;
    this.turns = 0;
    this.quietMoves = 0;
    this.positions = new Map([[positionKey(this.board, player), 1]]);
    this.outcome = this.moves.length
      ? null
      : { type: 'winner', player: otherPlayer(player), turns: 0 };
  }

  get moves() {
    return legalMoves(this.board, this.player);
  }

  play(id) {
    if (this.outcome) throw new Error('This game has already finished.');
    const move = this.moves.find((candidate) => candidate.id === id);
    if (!move) throw new Error('The selected move is not legal in this position.');
    const player = this.player;
    const piece = this.board.find((candidate) => candidate.square === move.from);
    this.quietMoves = move.captures.length || !piece.king ? 0 : this.quietMoves + 1;
    this.board = applyMove(this.board, player, id);
    this.player = otherPlayer(player);
    this.turns++;
    const key = positionKey(this.board, this.player);
    const occurrences = (this.positions.get(key) ?? 0) + 1;
    this.positions.set(key, occurrences);

    if (!this.moves.length) {
      this.outcome = { type: 'winner', player, turns: this.turns };
    } else if (occurrences >= 3) {
      this.outcome = { type: 'draw', reason: 'repetition', turns: this.turns };
    } else if (this.quietMoves >= 80) {
      // Forty turns per player with no capture and no move by an uncrowned piece.
      this.outcome = { type: 'draw', reason: 'no-progress', turns: this.turns };
    } else if (this.turns >= this.moveLimit) {
      // A demo request limit, not a checkers win or draw rule.
      this.outcome = { type: 'limit', turns: this.turns };
    }
    return { board: this.board, player, move, turn: this.turns };
  }
}
