import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { workaroundFitInputSchema, workaroundFitResultSchema } from './schema.js';
import type { WorkaroundFitInput, WorkaroundFitResult } from './schema.js';

export async function workaroundFit(
  input: WorkaroundFitInput,
  options: RecipeOptions = {},
): Promise<WorkaroundFitResult> {
  const { minConfidence = 0.8, ...state } = workaroundFitInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Can workaround address issue without violating constraints? Check the stated prerequisites and restrictions. Do not assume permissions, tools, or capabilities not supplied.',
    {
      fits: 'The described workaround addresses the issue and satisfies the stated constraints.',
      conflicts:
        'The workaround contradicts a stated constraint or cannot address the described issue.',
      unclear: 'A needed prerequisite or effect is not established.',
    },
    options,
  );
  return workaroundFitResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  workaroundFitInputSchema,
  workaroundFitResultSchema,
  workaroundFitVerdictSchema,
} from './schema.js';
export type { WorkaroundFitInput, WorkaroundFitResult, WorkaroundFitVerdict } from './schema.js';
