import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { commitMessageFitInputSchema, commitMessageFitResultSchema } from './schema.js';
import type { CommitMessageFitInput, CommitMessageFitResult } from './schema.js';

export async function commitMessageFit(
  input: CommitMessageFitInput,
  options: RecipeOptions = {},
): Promise<CommitMessageFitResult> {
  const { minConfidence = 0.8, ...state } = commitMessageFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does message accurately describe change? A message fits when every material part of change is reflected and nothing is claimed that change does not contain. Wording, tense, and brevity do not matter. Omitting a trivial detail does not count; omitting a distinct behavior change or claiming work that is absent does.',
    {
      true: 'The message covers every material part of the change and claims nothing the change does not do.',
      false:
        'The message omits a material part of the change or claims work that the change does not contain.',
    },
    options,
  );
  return commitMessageFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'fits' : 'mismatched',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  commitMessageFitInputSchema,
  commitMessageFitResultSchema,
  commitMessageFitVerdictSchema,
} from './schema.js';
export type {
  CommitMessageFitInput,
  CommitMessageFitResult,
  CommitMessageFitVerdict,
} from './schema.js';
