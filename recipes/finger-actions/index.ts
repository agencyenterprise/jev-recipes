import { evaluateAssignments } from '../../src/assignments.js';
import type { RecipeOptions } from '../../src/schema.js';
import { fingerActionsInputSchema } from './schema.js';
import type { FingerActionsInput, FingerActionsResult } from './schema.js';

export async function fingerActions(
  input: FingerActionsInput,
  options: RecipeOptions = {},
): Promise<FingerActionsResult> {
  const { minConfidence = 0.8, ...state } = fingerActionsInputSchema.parse(input);
  return evaluateAssignments(
    state,
    state.fingers,
    (index) =>
      `What should fingers[${index}] (described in fingers[${index}].text) do on beat, given the recent material, key, and tempo in music and any style? Choose one of its listed options so the whole hand plays a coherent, idiomatic voicing with the other fingers' likely actions. Judge only this finger.`,
    minConfidence,
    options,
    'finger',
  );
}

export { fingerActionsInputSchema, fingerActionsResultSchema } from './schema.js';
export type { FingerActionsInput, FingerActionsResult } from './schema.js';
