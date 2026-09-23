import { z } from 'zod';
import { nonEmptyText, probability, selectionResultSchema } from '../../src/schema.js';

const player = z.enum(['red', 'black']);
const square = z
  .string()
  .regex(/^(?:[aceg][1357]|[bdfh][2468])$/)
  .describe('A playable square: a1 is bottom left; files a-h, ranks 1-8.');
const piece = z.strictObject({
  square,
  player,
  king: z.boolean().optional().describe('True for a king; omitted or false for a man.'),
});
const move = z
  .strictObject({
    id: nonEmptyText
      .refine((value) => value !== '__proto__', 'This ID is reserved by result serialization.')
      .describe('Your move ID, returned unchanged when selected. __proto__ is reserved.'),
    from: square,
    path: z
      .array(square)
      .min(1)
      .max(12)
      .describe('Every landing square in order, excluding from. Include the full jump sequence.'),
    captures: z
      .array(square)
      .max(12)
      .optional()
      .describe('Captured piece squares in jump order. Omit or use [] for an ordinary move.'),
  })
  .refine(
    (value) => new Set(value.captures).size === (value.captures?.length ?? 0),
    'A piece cannot be captured twice in one move.',
  )
  .refine(
    (value) => value.path.length === Math.max(1, value.captures?.length ?? 0),
    'Use one landing for an ordinary move, or one landing per captured piece.',
  );

export const checkersMoveInputSchema = z
  .strictObject({
    board: z
      .array(piece)
      .min(1)
      .max(24)
      .refine(
        (pieces) => new Set(pieces.map((value) => value.square)).size === pieces.length,
        'Each board square can hold only one piece.',
      )
      .refine(
        (pieces) =>
          pieces.filter((value) => value.player === 'red').length <= 12 &&
          pieces.filter((value) => value.player === 'black').length <= 12,
        'Each player can have at most twelve pieces.',
      )
      .describe(
        'All remaining pieces. Unlisted squares are empty; red moves toward rank 8, black toward rank 1.',
      ),
    player: player.describe('The side whose turn it is and whose move should be chosen.'),
    legalMoves: z
      .array(move)
      .min(1)
      .refine(
        (moves) => new Set(moves.map((value) => value.id)).size === moves.length,
        'Move IDs must be unique.',
      )
      .describe('One or more complete legal moves from your game, with unique IDs.'),
    minConfidence: probability.optional(),
  })
  .superRefine((input, context) => {
    const pieces = new Map(input.board.map((value) => [value.square, value]));
    input.legalMoves.forEach((value, index) => {
      if (pieces.get(value.from)?.player !== input.player) {
        context.addIssue({
          code: 'custom',
          path: ['legalMoves', index, 'from'],
          message: 'The starting square must contain a piece owned by player.',
        });
      }
      value.captures?.forEach((captured, captureIndex) => {
        const target = pieces.get(captured);
        if (target === undefined || target.player === input.player) {
          context.addIssue({
            code: 'custom',
            path: ['legalMoves', index, 'captures', captureIndex],
            message: 'Each captured square must contain an opponent piece.',
          });
        }
      });
    });
  });

export const checkersMoveResultSchema = selectionResultSchema;
export type CheckersMoveInput = z.infer<typeof checkersMoveInputSchema>;
export type CheckersMoveResult = z.infer<typeof checkersMoveResultSchema>;
