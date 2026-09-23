import { choice } from '@typesafe-ai/sdk';
import { evaluateWithJev } from '../../src/client.js';
import { parseChoiceAnswer } from '../../src/answers.js';
import { parseDecisionState } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { gameActionInputSchema, gameActionResultSchema } from './schema.js';
import type { GameActionInput, GameActionResult } from './schema.js';

const instructions = [
  'Which available action should this player take next, given the supplied game state, player state, rules, and objective?',
  ...Object.entries(gameActionInputSchema.shape).map(
    ([name, schema]) => `${name}: ${schema.description}`,
  ),
].join('\n');

export async function gameAction(
  input: GameActionInput,
  options: RecipeOptions = {},
): Promise<GameActionResult> {
  const { legalActions, ...state } = gameActionInputSchema.parse(input);
  if (legalActions.length === 0) return null;

  const actions = Object.fromEntries(
    legalActions.map((action, index) => [`action_${index}`, action]),
  );
  const criteria = Object.fromEntries(
    Object.entries(actions).map(([label, action]) => [label, JSON.stringify(action)]),
  );
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: { decision: choice(instructions, criteria) },
    },
    options,
  );
  const answer = parseChoiceAnswer(response.answers.decision, Object.keys(actions));

  return gameActionResultSchema.parse({
    selection: answer.choice,
    action: actions[answer.choice],
    confidence: answer.confidence,
    probabilities: answer.probabilities,
    model: response.model,
    usage: response.usage,
  });
}

export { gameActionInputSchema, gameActionResultSchema } from './schema.js';
export type { GameActionInput, GameActionResult } from './schema.js';
