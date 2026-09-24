import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  changeRiskInputSchema,
  changeRiskResultSchema,
  changeRiskVerdictSchema,
} from './schema.js';
import type { ChangeRiskInput, ChangeRiskResult } from './schema.js';

export async function changeRisk(
  input: ChangeRiskInput,
  options: RecipeOptions = {},
): Promise<ChangeRiskResult> {
  const { minConfidence = 0.8, ...state } = changeRiskInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How risky is change to ship, given any context? Judge the blast radius, the sensitivity of the code paths and data it touches, and how hard the change would be to reverse. Ignore the size of the description.',
    [
      'The change touches only documentation, comments, formatting, or dead code with no runtime effect.',
      'The change is isolated to well-tested logic with a narrow blast radius and an easy rollback.',
      'The change alters shared code paths, public interfaces, or data shapes that other components depend on.',
      'The change touches authentication, payments, migrations, concurrency, or a wide blast radius across the system.',
      'The change carries irreversible data loss or security impact if it is wrong.',
    ],
    options,
  );
  return changeRiskResultSchema.parse({
    ...decision,
    risk: changeRiskVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  changeRiskInputSchema,
  changeRiskResultSchema,
  changeRiskVerdictSchema,
} from './schema.js';
export type { ChangeRiskInput, ChangeRiskResult, ChangeRiskVerdict } from './schema.js';
