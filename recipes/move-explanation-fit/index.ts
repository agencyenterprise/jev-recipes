import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { moveExplanationFitInputSchema, moveExplanationFitResultSchema } from './schema.js';
import type { MoveExplanationFitInput, MoveExplanationFitResult } from './schema.js';

export async function moveExplanationFit(
  input: MoveExplanationFitInput,
  options: RecipeOptions = {},
): Promise<MoveExplanationFitResult> {
  const { minConfidence = 0.8, ...state } = moveExplanationFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does explanation give a reason for move that is consistent with state? Check that the pieces, positions, threats, resources, and turn order that explanation relies on are actually present in state, and that the reason it gives actually concerns move rather than a different action. Treat the explanation as consistent when every fact it cites can be found in state and the reasoning connects to move. Treat it as inconsistent when it cites something absent from or contradicted by state, or when it justifies a different move. Do not judge whether move is a good move.',
    {
      true: 'Every fact the explanation relies on is present in the state as described, and the reasoning given is about the move in question.',
      false:
        'The explanation cites a piece, position, threat, or resource that the state does not contain or contradicts, or its reasoning justifies a different move.',
    },
    options,
  );
  return moveExplanationFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'consistent' : 'inconsistent',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  moveExplanationFitInputSchema,
  moveExplanationFitResultSchema,
  moveExplanationFitVerdictSchema,
} from './schema.js';
export type {
  MoveExplanationFitInput,
  MoveExplanationFitResult,
  MoveExplanationFitVerdict,
} from './schema.js';
