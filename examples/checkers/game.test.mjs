import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkersMoveInputSchema } from 'jev-recipes/checkers-move';
import { applyMove, legalMoves, startingBoard } from './game.mjs';

const piece = (square, player, king = false) => ({ square, player, king });

test('the standard opening has 12 men per side and seven legal first moves', () => {
  assert.equal(startingBoard.length, 24);
  assert.equal(new Set(startingBoard.map((value) => value.square)).size, 24);
  for (const player of ['red', 'black']) {
    const pieces = startingBoard.filter((value) => value.player === player);
    assert.equal(pieces.length, 12);
    assert.ok(pieces.every((value) => !value.king));
    assert.ok(
      pieces.every((value) => (player === 'red' ? '123' : '678').includes(value.square[1])),
    );
    const moves = legalMoves(startingBoard, player);
    assert.equal(moves.length, 7);
    assert.ok(moves.every((value) => value.captures.length === 0));
    checkersMoveInputSchema.parse({ board: startingBoard, player, legalMoves: moves });
  }
  const saved = structuredClone(startingBoard);
  const next = applyMove(startingBoard, 'red', 'c3-d4');
  assert.equal(next.length, 24);
  assert.ok(next.some((value) => value.square === 'd4' && value.player === 'red'));
  assert.deepEqual(startingBoard, saved, 'Playing must not mutate the starting position.');
});

test('mandatory captures suppress ordinary moves and include full jump sequences', () => {
  const board = [
    piece('c3', 'red'),
    piece('h2', 'red'),
    piece('b4', 'black'),
    piece('d4', 'black'),
    piece('f6', 'black', true),
  ];
  const moves = legalMoves(board, 'red');
  assert.deepEqual(moves, [
    { id: 'c3-a5', from: 'c3', path: ['a5'], captures: ['b4'] },
    { id: 'c3-e5-g7', from: 'c3', path: ['e5', 'g7'], captures: ['d4', 'f6'] },
  ]);
  assert.deepEqual(applyMove(board, 'red', 'c3-e5-g7'), [
    piece('h2', 'red'),
    piece('b4', 'black'),
    piece('g7', 'red'),
  ]);
  assert.throws(() => applyMove(board, 'red', 'c3-e5'));
  assert.throws(() => applyMove(board, 'red', 'h2-g3'));
});

test('men do not move or capture backwards; kings can', () => {
  const board = [piece('d4', 'red'), piece('c3', 'black')];
  assert.deepEqual(
    legalMoves(board, 'red').map((move) => move.id),
    ['d4-c5', 'd4-e5'],
  );
  board[0].king = true;
  assert.deepEqual(legalMoves(board, 'red'), [
    { id: 'd4-b2', from: 'd4', path: ['b2'], captures: ['c3'] },
  ]);
});

test('crowning ends the jump instead of continuing backwards as a new king', () => {
  const board = [piece('b6', 'red'), piece('c7', 'black'), piece('e7', 'black')];
  assert.deepEqual(legalMoves(board, 'red'), [
    { id: 'b6-d8', from: 'b6', path: ['d8'], captures: ['c7'] },
  ]);
  assert.deepEqual(applyMove(board, 'red', 'b6-d8'), [
    piece('e7', 'black'),
    piece('d8', 'red', true),
  ]);
});

test('black promotion uses rank 1 and kings can complete a loop without recapturing a piece', () => {
  const board = [piece('g3', 'black'), piece('f2', 'red'), piece('d2', 'red')];
  assert.deepEqual(legalMoves(board, 'black'), [
    { id: 'g3-e1', from: 'g3', path: ['e1'], captures: ['f2'] },
  ]);
  assert.equal(applyMove(board, 'black', 'g3-e1').at(-1).king, true);
  const loop = [
    piece('c3', 'red', true),
    ...['d4', 'f4', 'f2', 'd2'].map((square) => piece(square, 'black')),
  ];
  const moves = legalMoves(loop, 'red');
  assert.equal(moves.length, 2);
  for (const move of moves) {
    assert.equal(move.path.at(-1), 'c3');
    assert.equal(move.captures.length, 4);
    assert.deepEqual(applyMove(loop, 'red', move.id), [piece('c3', 'red', true)]);
  }
});

test('the board edges and occupied squares are respected', () => {
  assert.deepEqual(
    legalMoves([piece('a1', 'red')], 'red').map((move) => move.id),
    ['a1-b2'],
  );
  assert.deepEqual(
    legalMoves([piece('h8', 'black')], 'black').map((move) => move.id),
    ['h8-g7'],
  );
  assert.deepEqual(
    legalMoves([piece('a1', 'red'), piece('b2', 'black'), piece('c3', 'black')], 'red'),
    [],
  );
});
