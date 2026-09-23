import { z } from 'zod';
import { probability, resultMetadataSchema } from '../../src/schema.js';

export const gameActionInputSchema = z.object({
  gameState: z.json().describe('The current game information available for this decision.'),
  playerState: z.json().describe('Information about the player making this decision.'),
  legalActions: z.array(z.json()).describe('The available actions the player can choose from.'),
  rules: z.json().optional().describe('Game rules and explanations of game-specific information.'),
  objective: z.json().optional().describe('What the player is trying to accomplish.'),
});

export const gameActionResultSchema = resultMetadataSchema
  .extend({
    selection: z
      .string()
      .describe('The internal Choice label associated with the selected action.'),
    action: z.json().describe('The original selected action, preserving any existing game ID.'),
    confidence: probability.describe('The confidence returned by Jev.'),
    probabilities: z
      .record(z.string(), probability)
      .describe("Jev's probabilities, keyed by internal Choice label."),
  })
  .nullable();

export type GameActionInput = z.infer<typeof gameActionInputSchema>;
export type GameActionResult = z.infer<typeof gameActionResultSchema>;
