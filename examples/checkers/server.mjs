import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { chooseMove } from './ai.mjs';
import { CheckersMatch } from './match.mjs';

const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/style.css', ['style.css', 'text/css']],
]);

export function createDemoServer({ decide = chooseMove, delayMs = 350, matchOptions } = {}) {
  let playing = false;
  return createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, message) => {
      response.writeHead(status, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: message }));
    };
    const url = new URL(request.url, 'http://localhost');
    if (request.method === 'GET' && files.has(url.pathname)) {
      const [name, type] = files.get(url.pathname);
      response.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
      response.end(await readFile(new URL(name, import.meta.url)));
      return;
    }
    if (request.method === 'GET' && url.pathname === '/board') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      const match = new CheckersMatch(matchOptions);
      response.end(JSON.stringify({ board: match.board, player: match.player }));
      return;
    }
    if (request.method !== 'POST' || url.pathname !== '/play') return send(404, 'Not found.');
    const host = request.headers.host;
    const expectedOrigin = `http://${host}`;
    if (
      !/^(127\.0\.0\.1|localhost):\d+$/.test(host ?? '') ||
      request.headers.origin !== expectedOrigin ||
      request.headers['content-type'] !== 'application/json'
    )
      return send(403, 'Open this example from its localhost address.');
    if (playing) return send(409, 'A game is already running. Wait for it to finish.');
    request.resume();
    playing = true;
    const controller = new AbortController();
    response.on('close', () => controller.abort());
    response.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8' });
    const emit = (event) => {
      if (!response.destroyed) response.write(JSON.stringify(event) + '\n');
    };
    const match = new CheckersMatch(matchOptions);
    emit({ type: 'start', board: match.board, player: match.player });
    try {
      while (!match.outcome) {
        controller.signal.throwIfAborted();
        const { board, player } = match;
        const moves = match.moves;
        const turn = match.turns + 1;
        emit({ type: 'thinking', player, turn });
        const started = performance.now();
        const decision = await decide(
          { board, player, legalMoves: moves },
          AbortSignal.any([controller.signal, AbortSignal.timeout(12_000)]),
        );
        controller.signal.throwIfAborted();
        // Autoplay policy: resolve an unclear choice using the highest candidate probability.
        // Equal probabilities keep the first legal move. The page labels this as a tiebreak.
        const tieBreak = decision.selection === null;
        const selected = tieBreak
          ? moves.reduce((best, candidate) =>
              decision.probabilities.candidates[candidate.id] >
              decision.probabilities.candidates[best.id]
                ? candidate
                : best,
            ).id
          : decision.selection;
        const move = moves.find((candidate) => candidate.id === selected);
        if (!move) throw new Error('Jev returned an unavailable move. Press Play to try again.');
        const elapsedMs = Math.round(performance.now() - started);
        emit({ type: 'move', ...match.play(move.id), elapsedMs, tieBreak });
        if (!match.outcome && delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      emit(match.outcome);
    } catch (error) {
      if (!controller.signal.aborted) {
        // Never return provider response bodies, request headers, or credentials to the page.
        const message =
          error.message.startsWith('Add TYPESAFE_API_KEY') || error.message.startsWith('Jev ')
            ? error.message
            : 'The Jev request failed or timed out. Check your key and connection, then press Play.';
        emit({ type: 'error', message });
      }
    } finally {
      playing = false;
      response.end();
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.CHECKERS_PORT ?? 8787);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('CHECKERS_PORT must be a valid port number.');
  const server = createDemoServer();
  server.on('error', (error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () =>
    console.log(`Open http://127.0.0.1:${port} and press Play.`),
  );
}
