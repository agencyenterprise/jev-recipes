import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { gamePhaseInputSchema, gamePhaseResultSchema } from './schema.js';
import type { GamePhaseInput, GamePhaseResult } from './schema.js';

export async function gamePhase(
  input: GamePhaseInput,
  options: RecipeOptions = {},
): Promise<GamePhaseResult> {
  const { minConfidence = 0.8, ...state } = gamePhaseInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Which phase of the game does state describe? Use rules when supplied to understand what counts as setup, development, reduced material, and a finished game; otherwise rely on common conventions for the game named or implied in state. Opening means early setup or development with most resources still in play. Midgame means resources are engaged and contested with no side close to a decisive result. Endgame means resources are depleted or the outcome is close and play is about converting or defending. Terminal means state describes a finished game with a winner, loser, or draw already determined. Use unclear when state gives too little to place it.',
    {
      opening:
        'The state shows early setup or development, with most pieces, cards, or resources still available and little direct conflict.',
      midgame:
        'The state shows resources engaged and contested, with meaningful material or options remaining on each side and no decisive result near.',
      endgame:
        'The state shows depleted resources or a nearly decided outcome, with play focused on converting an advantage or holding a defense.',
      terminal:
        'The state describes a finished game: a checkmate, elimination, agreed draw, or final score is stated.',
      unclear:
        'The state gives too little information about the game or its progress to place it in a phase.',
    },
    options,
  );
  return gamePhaseResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export { gamePhaseInputSchema, gamePhaseResultSchema, gamePhaseVerdictSchema } from './schema.js';
export type { GamePhaseInput, GamePhaseResult, GamePhaseVerdict } from './schema.js';
