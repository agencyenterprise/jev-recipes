// Example-only American/English checkers rules. The recipe chooses; this module moves pieces.
export const otherPlayer = (player) => (player === 'red' ? 'black' : 'red');
const point = (square) => [square.charCodeAt(0) - 97, Number(square[1]) - 1];
const squareAt = (x, y) =>
  x >= 0 && x < 8 && y >= 0 && y < 8 ? `${String.fromCharCode(97 + x)}${y + 1}` : null;
const crowned = (piece, square) => piece.king || square[1] === (piece.player === 'red' ? '8' : '1');
const directions = (piece) => (piece.king ? [-1, 1] : [piece.player === 'red' ? 1 : -1]);

export function legalMoves(board, player) {
  const captures = [];
  const steps = [];
  function jumps(piece, position, from, path = [], taken = []) {
    const [x, y] = point(piece.square);
    let continued = false;
    for (const dy of directions(piece)) {
      for (const dx of [-1, 1]) {
        const over = squareAt(x + dx, y + dy);
        const to = squareAt(x + dx * 2, y + dy * 2);
        const target = position.find((candidate) => candidate.square === over);
        if (
          !to ||
          !target ||
          target.player === player ||
          position.some((candidate) => candidate.square === to)
        )
          continue;
        continued = true;
        const nextPath = [...path, to];
        const nextTaken = [...taken, over];
        if (!piece.king && crowned(piece, to)) {
          captures.push({ from, path: nextPath, captures: nextTaken });
        } else {
          jumps(
            { ...piece, square: to },
            position
              .filter((candidate) => candidate.square !== piece.square && candidate.square !== over)
              .concat({ ...piece, square: to }),
            from,
            nextPath,
            nextTaken,
          );
        }
      }
    }
    if (!continued && taken.length) captures.push({ from, path, captures: taken });
  }
  for (const piece of board.filter((candidate) => candidate.player === player)) {
    jumps(piece, board, piece.square);
    const [x, y] = point(piece.square);
    for (const dy of directions(piece)) {
      for (const dx of [-1, 1]) {
        const to = squareAt(x + dx, y + dy);
        if (to && !board.some((candidate) => candidate.square === to))
          steps.push({ from: piece.square, path: [to], captures: [] });
      }
    }
  }
  return (captures.length ? captures : steps).map((move) => ({
    id: [move.from, ...move.path].join('-'),
    ...move,
  }));
}

export function applyMove(board, player, id) {
  const move = legalMoves(board, player).find((candidate) => candidate.id === id);
  if (!move) throw new Error('The selected move is not legal in this position.');
  const piece = board.find((candidate) => candidate.square === move.from);
  const to = move.path.at(-1);
  return board
    .filter(
      (candidate) => candidate.square !== move.from && !move.captures.includes(candidate.square),
    )
    .concat({ ...piece, square: to, king: Boolean(crowned(piece, to)) });
}

// Standard opening: 12 pieces per side, with a1 at the lower-left dark square.
export const startingBoard = [1, 2, 3, 6, 7, 8].flatMap((rank) =>
  Array.from({ length: 4 }, (_, index) => ({
    square: `${String.fromCharCode(97 + index * 2 + (rank % 2 === 0 ? 1 : 0))}${rank}`,
    player: rank <= 3 ? 'red' : 'black',
  })),
);
