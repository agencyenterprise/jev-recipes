import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { objectiveFitInputSchema, objectiveFitResultSchema } from './schema.js';
import type { ObjectiveFitInput, ObjectiveFitResult } from './schema.js';

export async function objectiveFit(
  input: ObjectiveFitInput,
  options: RecipeOptions = {},
): Promise<ObjectiveFitResult> {
  const { minConfidence = 0.8, ...state } = objectiveFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does question assess the skill or knowledge named in objective, rather than something adjacent? A question assesses the objective when a correct answer requires the stated skill or knowledge at the stated level. It misses when it can be answered with recall, a different skill, or a lower cognitive level than objective names, or when it tests a related topic objective does not cover.',
    {
      true: 'Answering the question correctly requires the skill or knowledge stated in the objective.',
      false:
        'The question can be answered without the stated skill or knowledge, or it tests an adjacent topic.',
    },
    options,
  );
  return objectiveFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'assesses' : 'misses',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  objectiveFitInputSchema,
  objectiveFitResultSchema,
  objectiveFitVerdictSchema,
} from './schema.js';
export type { ObjectiveFitInput, ObjectiveFitResult, ObjectiveFitVerdict } from './schema.js';
