import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { changeWindowFitInputSchema, changeWindowFitResultSchema } from './schema.js';
import type { ChangeWindowFitInput, ChangeWindowFitResult } from './schema.js';

export async function changeWindowFit(
  input: ChangeWindowFitInput,
  options: RecipeOptions = {},
): Promise<ChangeWindowFitResult> {
  const { minConfidence = 0.8, ...state } = changeWindowFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does change fall within the change-window or freeze policy stated in policy? Judge only the timing, environment, and change type that change states against the windows, freezes, and exceptions that policy states. Treat a day or date named in change as given; do not compute whether a date is a weekday or falls in a freeze period unless the text states it. Ignore how risky or well-tested the change sounds.',
    {
      true: 'The stated timing, environment, and type of change fit within a window that policy permits, or match an exception that policy grants.',
      false:
        'The stated timing, environment, or type of change falls in a period policy forbids or outside every window it permits, and no stated exception applies.',
    },
    options,
  );
  return changeWindowFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'allowed' : 'blocked',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  changeWindowFitInputSchema,
  changeWindowFitResultSchema,
  changeWindowFitVerdictSchema,
} from './schema.js';
export type {
  ChangeWindowFitInput,
  ChangeWindowFitResult,
  ChangeWindowFitVerdict,
} from './schema.js';
