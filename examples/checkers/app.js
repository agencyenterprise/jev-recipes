const boardElement = document.querySelector('#board');
const status = document.querySelector('#status');
const detail = document.querySelector('#detail');
const result = document.querySelector('.result');
const play = document.querySelector('#play');
const name = (player) => (player === 'red' ? 'Red' : 'Black');
const coordinate = (square) => ({ x: square.charCodeAt(0) - 97, y: 8 - Number(square[1]) });

function activePlayer(player) {
  for (const color of ['red', 'black'])
    document.querySelector(`#${color}-player`).classList.toggle('active', player === color);
}

function drawBoard(board, move) {
  boardElement.replaceChildren();
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = `${String.fromCharCode(97 + file)}${rank}`;
      const cell = document.createElement('div');
      cell.className = `square ${(file + rank) % 2 === 1 ? 'dark' : ''}`;
      if (move && (move.from === square || move.path.includes(square))) cell.classList.add('last');
      boardElement.append(cell);
    }
  }
  for (const piece of board) {
    const element = document.createElement('div');
    const { x, y } = coordinate(piece.square);
    element.className = `piece ${piece.player}`;
    element.dataset.square = piece.square;
    element.style.left = `${x * 12.5 + 1.7}%`;
    element.style.top = `${y * 12.5 + 1.7}%`;
    if (piece.king) element.textContent = 'K';
    boardElement.append(element);
  }
  boardElement.setAttribute(
    'aria-label',
    board
      .map((piece) => `${name(piece.player)} ${piece.king ? 'king' : 'piece'} on ${piece.square}`)
      .join(', '),
  );
}

async function animateMove(move) {
  const piece = boardElement.querySelector(`[data-square="${move.from}"]`);
  if (!piece || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const start = coordinate(move.from);
  const size = boardElement.clientWidth / 8;
  const frames = [move.from, ...move.path].map((square) => {
    const next = coordinate(square);
    return {
      transform: `translate(${(next.x - start.x) * size}px, ${(next.y - start.y) * size}px)`,
    };
  });
  await piece.animate(frames, {
    duration: 180 * move.path.length,
    easing: 'ease-in-out',
    fill: 'forwards',
  }).finished;
}

async function show(event) {
  if (event.type === 'start') {
    result.className = 'result';
    drawBoard(event.board);
    activePlayer(event.player);
    detail.textContent = 'Red moves first.';
  } else if (event.type === 'thinking') {
    activePlayer(event.player);
    status.textContent = `${name(event.player)} is choosing…`;
  } else if (event.type === 'move') {
    await animateMove(event.move);
    drawBoard(event.board, event.move);
    status.textContent = `${name(event.player)} moves ${event.move.from} → ${event.move.path.join(' → ')}`;
    detail.textContent = `Move ${event.turn} · ${(event.elapsedMs / 1000).toFixed(2)}s decision${event.tieBreak ? ' · automatic tiebreak' : ''}`;
  } else if (event.type === 'winner') {
    result.className = 'result winner';
    activePlayer(event.player);
    status.textContent = `${name(event.player)} wins.`;
    detail.textContent = `Finished in ${event.turns} moves.`;
    return true;
  } else if (event.type === 'draw' || event.type === 'limit') {
    result.className = 'result winner';
    activePlayer(null);
    status.textContent = event.type === 'draw' ? 'Draw.' : 'Move limit reached.';
    const reason =
      event.type === 'limit'
        ? 'Demo stopped without a winner'
        : event.reason === 'repetition'
          ? 'The same position occurred three times'
          : '40 turns each without a capture or moving a regular piece';
    detail.textContent = `${reason}. ${event.turns} moves.`;
    return true;
  } else if (event.type === 'error') {
    throw new Error(event.message);
  } else {
    throw new Error('Unexpected game update. Reload the page and try again.');
  }
  return false;
}

play.addEventListener('click', async () => {
  play.disabled = true;
  play.textContent = 'Playing…';
  status.textContent = 'Starting…';
  let finished = false;
  try {
    const response = await fetch('/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!response.ok) throw new Error((await response.json()).error);
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let pending = '';
    try {
      while (true) {
        const { value = '', done } = await reader.read();
        pending += value;
        let newline;
        while ((newline = pending.indexOf('\n')) !== -1) {
          const line = pending.slice(0, newline);
          pending = pending.slice(newline + 1);
          if (line) finished = (await show(JSON.parse(line))) || finished;
        }
        if (done) break;
      }
      if (!finished) throw new Error('The game connection ended. Press Play to try again.');
    } finally {
      await reader.cancel();
    }
  } catch (error) {
    result.className = 'result error';
    status.textContent = error.message;
    detail.textContent = 'No winner was declared.';
  } finally {
    play.disabled = false;
    play.textContent = 'Play again';
  }
});

try {
  const response = await fetch('/board');
  if (!response.ok) throw new Error('Could not load the board. Restart the local server.');
  const game = await response.json();
  drawBoard(game.board);
  activePlayer(game.player);
  status.textContent = 'Press Play. Jev takes both sides.';
  detail.textContent = '24 pieces. A full game. No human moves.';
  play.disabled = false;
} catch (error) {
  status.textContent = error.message;
}
