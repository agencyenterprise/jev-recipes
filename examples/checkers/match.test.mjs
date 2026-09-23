import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkersMoveInputSchema } from 'jev-recipes/checkers-move';
import { CheckersMatch, positionKey } from './match.mjs';

const king = (square, player) => ({ square, player, king: true });
const twoKings = [king('a1', 'red'), king('h8', 'black')];

test('position identity includes the side to move and kings, but ignores array order', () => {
  assert.equal(positionKey(twoKings, 'red'), positionKey([...twoKings].reverse(), 'red'));
  assert.notEqual(positionKey(twoKings, 'red'), positionKey(twoKings, 'black'));
  assert.notEqual(
    positionKey(twoKings, 'red'),
    positionKey(
      twoKings.map(({ square, player }) => ({ square, player })),
      'red',
    ),
  );
});

test('the third occurrence of a position ends the game, including the initial position', () => {
  const match = new CheckersMatch({ board: twoKings });
  const cycle = ['a1-b2', 'h8-g7', 'b2-a1', 'g7-h8'];
  for (const id of cycle) match.play(id);
  assert.equal(match.outcome, null);
  for (const id of cycle) match.play(id);
  assert.deepEqual(match.outcome, { type: 'draw', reason: 'repetition', turns: 8 });
  assert.throws(() => match.play('a1-b2'), /already finished/);
  assert.deepEqual(twoKings, [king('a1', 'red'), king('h8', 'black')]);
});

test('moving a man or capturing resets the count of moves without progress', () => {
  const men = new CheckersMatch({ board: [...twoKings, { square: 'c1', player: 'red' }] });
  men.play('a1-b2');
  men.play('h8-g7');
  assert.equal(men.quietMoves, 2);
  men.play('c1-d2');
  assert.equal(men.quietMoves, 0);

  const capture = new CheckersMatch({
    board: [king('c3', 'red'), king('f6', 'black')],
    moveLimit: 3,
  });
  capture.play('c3-d4');
  capture.play('f6-e5');
  assert.equal(capture.quietMoves, 2);
  capture.play('d4-f6');
  assert.equal(capture.quietMoves, 0);
  assert.deepEqual(
    capture.outcome,
    { type: 'winner', player: 'red', turns: 3 },
    'A win takes precedence over the demo limit.',
  );
});

test('40 turns per side without progress ends in a draw, not after 40 individual moves', () => {
  const match = new CheckersMatch({ board: twoKings });
  // A legal walk by two kings with no third repetition and no captures.
  const path = `a1-b2 h8-g7 b2-c1 g7-h8 c1-b2 h8-g7 b2-a1 g7-f6
    a1-b2 f6-e5 b2-a1 e5-d4 a1-b2 d4-e5 b2-c1 e5-f4
    c1-d2 f4-e5 d2-c1 e5-d6 c1-b2 d6-c7 b2-a1 c7-d6
    a1-b2 d6-e7 b2-c1 e7-f8 c1-d2 f8-e7 d2-e3 e7-f8
    e3-d2 f8-g7 d2-e3 g7-h8 e3-d4 h8-g7 d4-c5 g7-h6
    c5-b6 h6-g5 b6-a5 g5-h6 a5-b6 h6-g7 b6-a7 g7-h8
    a7-b8 h8-g7 b8-c7 g7-h6 c7-d6 h6-g7 d6-c7 g7-h6
    c7-d8 h6-g5 d8-c7 g5-f6 c7-b8 f6-g5 b8-a7 g5-h4
    a7-b8 h4-g3 b8-a7 g3-f4 a7-b6 f4-g3 b6-c7 g3-h4
    c7-b8 h4-g3 b8-c7 g3-f2 c7-b6 f2-e1 b6-a5 e1-d2`.split(/\s+/);
  for (const id of path) {
    assert.equal(match.outcome, null);
    match.play(id);
  }
  assert.equal(match.turns, 80);
  assert.deepEqual(match.outcome, { type: 'draw', reason: 'no-progress', turns: 80 });
});

test('an opponent with pieces but no legal move loses; the request limit has no winner', () => {
  const blocked = new CheckersMatch({
    board: [
      { square: 'a1', player: 'black' },
      { square: 'h8', player: 'red' },
    ],
  });
  assert.deepEqual(blocked.outcome, { type: 'winner', player: 'black', turns: 0 });
  const limited = new CheckersMatch({ moveLimit: 1 });
  limited.play(limited.moves[0].id);
  assert.deepEqual(limited.outcome, { type: 'limit', turns: 1 });
});

test('varied full games preserve the recipe contract, legal captures, and unique squares', () => {
  let seed = 12345;
  const random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  let crowned = false;
  let captured = false;
  const winners = new Set();
  for (let game = 0; game < 30; game++) {
    const match = new CheckersMatch();
    while (!match.outcome) {
      const moves = match.moves;
      checkersMoveInputSchema.parse({
        board: match.board,
        player: match.player,
        legalMoves: moves,
      });
      const move = moves[Math.floor(random() * moves.length)];
      const before = match.board.length;
      const event = match.play(move.id);
      assert.equal(before - event.board.length, move.captures.length);
      assert.equal(new Set(event.board.map((piece) => piece.square)).size, event.board.length);
      crowned ||= event.board.some((piece) => piece.king);
      captured ||= move.captures.length > 0;
    }
    if (match.outcome.type === 'winner') winners.add(match.outcome.player);
    assert.ok(match.turns <= 300);
  }
  assert.equal(crowned, true);
  assert.equal(captured, true);
  assert.deepEqual([...winners].sort(), ['black', 'red']);
});
