import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { lengthFitInputSchema, lengthFitResultSchema } from './schema.js';
import type { LengthFitInput, LengthFitResult } from './schema.js';

export async function lengthFit(
  input: LengthFitInput,
  options: RecipeOptions = {},
): Promise<LengthFitResult> {
  const { minConfidence = 0.8, ...state } = lengthFitInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Is the length and level of detail of response proportionate to what request asks for? Weigh any explicit length instruction in request first, then the scope of the question. Judge proportion, not correctness or tone.',
    {
      short:
        'The response omits detail that request asks for or clearly needs, leaving the request only partly answered.',
      fits: 'The response gives about the amount of detail request asks for, with no material omission or padding.',
      long: 'The response adds padding, repetition, or detail that request did not ask for and does not need.',
      unclear: 'The supplied request does not establish how much detail is wanted.',
    },
    options,
  );
  return lengthFitResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export { lengthFitInputSchema, lengthFitResultSchema, lengthFitVerdictSchema } from './schema.js';
export type { LengthFitInput, LengthFitResult, LengthFitVerdict } from './schema.js';
