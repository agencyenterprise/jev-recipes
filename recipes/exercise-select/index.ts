import { selectCandidate } from '../../src/selection.js';
import type { RecipeOptions } from '../../src/schema.js';
import { exerciseSelectInputSchema } from './schema.js';
import type { ExerciseSelectInput, ExerciseSelectResult } from './schema.js';

export async function exerciseSelect(
  input: ExerciseSelectInput,
  options: RecipeOptions = {},
): Promise<ExerciseSelectResult> {
  const { minConfidence = 0.8, ...state } = exerciseSelectInputSchema.parse(input);
  return selectCandidate(
    state,
    state.candidates,
    "Read feedback, a teacher's or app's comments on a player's performance, and pick the candidate practice exercise from candidates that most directly addresses the problems feedback raises, taking goal into account when it is supplied. Prefer a candidate that targets the specific problem and passage over one that is generically useful. Choose none when no candidate addresses the problems in feedback, and ambiguous when two or more address them equally well. Do not judge whether the feedback is correct or design a new exercise.",
    minConfidence,
    options,
  );
}

export { exerciseSelectInputSchema, exerciseSelectResultSchema } from './schema.js';
export type { ExerciseSelectInput, ExerciseSelectResult } from './schema.js';
