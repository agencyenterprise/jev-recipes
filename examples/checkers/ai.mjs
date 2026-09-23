import { TypeSafeClient } from '@typesafe-ai/sdk';
import { checkersMove } from 'jev-recipes/checkers-move';

export async function chooseMove({ board, player, legalMoves }, signal) {
  if (!process.env.TYPESAFE_API_KEY?.trim()) {
    throw new Error('Add TYPESAFE_API_KEY to examples/checkers/.env, then restart the example.');
  }
  return checkersMove(
    { board, player, legalMoves, minConfidence: 0 },
    {
      client: new TypeSafeClient({ timeout: 10_000, retry: { maxRetries: 0 }, logLevel: 'off' }),
      signal,
    },
  );
}
