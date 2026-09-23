import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { createDemoServer } from './server.mjs';
import { checkersMove } from 'jev-recipes/checkers-move';
import { applyMove, legalMoves, startingBoard } from './game.mjs';

async function start(t, decide, matchOptions) {
  const server = createDemoServer({ decide, delayMs: 0, matchOptions });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const url = `http://127.0.0.1:${server.address().port}`;
  return {
    url,
    play: (headers = {}) =>
      fetch(url + '/play', {
        method: 'POST',
        headers: { Origin: url, 'Content-Type': 'application/json', ...headers },
        body: '{}',
      }),
  };
}
const events = async (response) =>
  (await response.text())
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));

// Exercise the real recipe, but supply a local fixture client. Never call the provider.
function offlineDecision(input, signal) {
  const count = input.legalMoves.length;
  const labels = [...input.legalMoves.map((_, index) => `candidate_${index}`), 'none', 'ambiguous'];
  return checkersMove(
    { ...input, minConfidence: 0 },
    {
      signal,
      client: {
        systemOne: async () => ({
          model: 'offline-example-test',
          usage: { input_tokens: 0, output_tokens: 0 },
          answers: {
            decision: {
              type: 'choice',
              choice: `candidate_${count - 1}`,
              confidence: 1,
              probabilities: Object.fromEntries(
                labels.map((label) => [label, label === `candidate_${count - 1}` ? 1 : 0]),
              ),
            },
          },
        }),
      },
    },
  );
}

test('one Play streams a full game through the real recipe and finishes with a legal winner', async (t) => {
  const calls = [];
  const app = await start(t, async (input, signal) => {
    calls.push(input.player);
    return offlineDecision(input, signal);
  });
  const response = await app.play();
  assert.equal(response.status, 200);
  const stream = await events(response);
  assert.ok(calls.length > 4);
  calls.forEach((player, index) => assert.equal(player, index % 2 ? 'black' : 'red'));
  assert.equal(stream[0].type, 'start');
  const moves = stream.filter((event) => event.type === 'move');
  assert.equal(moves.length, calls.length);
  assert.deepEqual(stream[0].board, startingBoard);
  let board = structuredClone(startingBoard);
  for (const event of moves) {
    board = applyMove(board, event.player, event.move.id);
    assert.deepEqual(board, event.board);
    assert.equal(event.tieBreak, false);
    assert.ok(event.elapsedMs >= 0);
  }
  assert.equal(legalMoves(board, 'red').length, 0);
  assert.deepEqual(stream.at(-1), { type: 'winner', player: 'black', turns: calls.length });
  const replay = await events(await app.play());
  assert.deepEqual(replay[0].board, startingBoard, 'Play again starts a fresh game.');
  assert.deepEqual(replay.at(-1), stream.at(-1));
});

test('unclear decisions use a visibly labeled legal tiebreak and still finish', async (t) => {
  const app = await start(t, async (input) => ({
    status: 'review',
    selection: null,
    probabilities: {
      candidates: Object.fromEntries(input.legalMoves.map((move) => [move.id, 0.1])),
    },
  }));
  const stream = await events(await app.play());
  assert.equal(stream.at(-1).type, 'winner');
  for (const event of stream.filter((value) => value.type === 'move'))
    assert.equal(event.tieBreak, true);
});

test('draws and the demo limit stream their own endings without declaring a winner', async (t) => {
  const cycle = ['a1-b2', 'h8-g7', 'b2-a1', 'g7-h8'];
  let turn = 0;
  const draw = await start(t, async () => ({ selection: cycle[turn++ % 4] }), {
    board: [
      { square: 'a1', player: 'red', king: true },
      { square: 'h8', player: 'black', king: true },
    ],
  });
  const drawEvents = await events(await draw.play());
  assert.deepEqual(drawEvents.at(-1), { type: 'draw', reason: 'repetition', turns: 8 });
  assert.ok(!drawEvents.some((event) => event.type === 'winner'));
  const limit = await start(t, offlineDecision, { moveLimit: 2 });
  const limitEvents = await events(await limit.play());
  assert.deepEqual(limitEvents.at(-1), { type: 'limit', turns: 2 });
  assert.equal(limitEvents.filter((event) => event.type === 'move').length, 2);
});

test('invalid selections and provider failures stop without inventing a winner or leaking errors', async (t) => {
  for (const decide of [
    async () => ({ status: 'ready', selection: 'not-a-legal-move' }),
    async () => {
      throw new Error('secret-provider-response-do-not-show');
    },
  ]) {
    const app = await start(t, decide);
    const stream = await events(await app.play());
    assert.equal(stream.at(-1).type, 'error');
    assert.ok(!stream.some((value) => value.type === 'winner'));
    assert.ok(!JSON.stringify(stream).includes('secret-provider-response'));
  }
});

test('only public assets are served; keys, server code, and off-origin play are refused', async (t) => {
  let calls = 0;
  const app = await start(t, async (...args) => {
    calls++;
    return offlineDecision(...args);
  });
  for (const path of ['/', '/app.js', '/style.css', '/board'])
    assert.equal((await fetch(app.url + path)).status, 200);
  for (const path of ['/.env', '/server.mjs', '/game.mjs', '/../.env', '/README.md'])
    assert.equal((await fetch(app.url + path)).status, 404);
  assert.equal((await app.play({ Origin: 'https://elsewhere.example' })).status, 403);
  assert.equal((await app.play({ 'Content-Type': 'text/plain' })).status, 403);
  assert.equal(calls, 0);
});

test('a second Play cannot launch overlapping paid requests; disconnect cancels the first', async (t) => {
  let began;
  const started = new Promise((resolve) => {
    began = resolve;
  });
  let aborted;
  const stopped = new Promise((resolve) => {
    aborted = resolve;
  });
  const app = await start(t, async (_, signal) => {
    began();
    return new Promise((_, reject) =>
      signal.addEventListener(
        'abort',
        () => {
          aborted();
          reject(signal.reason);
        },
        { once: true },
      ),
    );
  });
  const response = await app.play();
  await started;
  assert.equal((await app.play()).status, 409);
  await response.body.cancel();
  await stopped;
});
