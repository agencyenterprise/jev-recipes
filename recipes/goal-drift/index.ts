import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { goalDriftInputSchema, goalDriftResultSchema } from './schema.js';
import type { GoalDriftInput, GoalDriftResult } from './schema.js';

export async function goalDrift(
  input: GoalDriftInput,
  options: RecipeOptions = {},
): Promise<GoalDriftResult> {
  const { minConfidence = 0.8, ...state } = goalDriftInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does step still serve goal, or has the work drifted to something goal did not ask for? Count step as drifted when it pursues a different objective, expands scope beyond what goal requires, or continues past the point where goal was already met. Necessary preparation, investigation, or fixes that are clearly on the path to goal are aligned. Use context, when supplied, for what has happened so far.',
    {
      true: 'The step pursues work that goal did not ask for or no longer needs.',
      false: 'The step is a reasonable move toward goal.',
    },
    options,
  );
  return goalDriftResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'drifted' : 'aligned',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export { goalDriftInputSchema, goalDriftResultSchema, goalDriftVerdictSchema } from './schema.js';
export type { GoalDriftInput, GoalDriftResult, GoalDriftVerdict } from './schema.js';
