import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  handoffCompletenessInputSchema,
  handoffCompletenessResultSchema,
  handoffCompletenessVerdictSchema,
} from './schema.js';
import type { HandoffCompletenessInput, HandoffCompletenessResult } from './schema.js';

export async function handoffCompleteness(
  input: HandoffCompletenessInput,
  options: RecipeOptions = {},
): Promise<HandoffCompletenessResult> {
  const { minConfidence = 0.8, ...state } = handoffCompletenessInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How ready is item, a work description being handed to another agent or person, to be picked up without asking questions? Judge whether item states the goal, supplies the inputs and context needed to start, defines what done looks like, and names constraints, ownership, and acceptance criteria. Ignore length and tone; a short item that covers every element is complete.',
    [
      'The goal is missing or too unclear to know what work is being asked for.',
      'The goal is stated, but the inputs, references, or context needed to start are missing.',
      'The goal and its inputs are present, but there is no definition of when the work is done.',
      'The goal, inputs, and definition of done are present, but constraints, ownership, or acceptance criteria are missing.',
      'The goal, inputs, definition of done, constraints, ownership, and acceptance criteria are all present.',
    ],
    options,
  );
  return handoffCompletenessResultSchema.parse({
    ...decision,
    completeness: handoffCompletenessVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  handoffCompletenessInputSchema,
  handoffCompletenessResultSchema,
  handoffCompletenessVerdictSchema,
} from './schema.js';
export type {
  HandoffCompletenessInput,
  HandoffCompletenessResult,
  HandoffCompletenessVerdict,
} from './schema.js';
