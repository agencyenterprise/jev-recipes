import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { runbookFitInputSchema, runbookFitResultSchema } from './schema.js';
import type { RunbookFitInput, RunbookFitResult } from './schema.js';

export async function runbookFit(
  input: RunbookFitInput,
  options: RecipeOptions = {},
): Promise<RunbookFitResult> {
  const { minConfidence = 0.8, ...state } = runbookFitInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    "Does runbook address the symptoms and component described in incident? Answer yes only when the runbook's stated symptoms or trigger match what incident describes and it targets the same component, service, or dependency. Ignore whether the runbook's steps are likely to work, and ignore formatting or length. A runbook for a similar symptom on a different component does not apply.",
    {
      true: 'The runbook names symptoms or a trigger matching what incident describes and targets the same component, service, or dependency.',
      false:
        'The runbook covers a different component, a different failure mode, or symptoms that do not match incident.',
    },
    options,
  );
  return runbookFitResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'applies' : 'inapplicable',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  runbookFitInputSchema,
  runbookFitResultSchema,
  runbookFitVerdictSchema,
} from './schema.js';
export type { RunbookFitInput, RunbookFitResult, RunbookFitVerdict } from './schema.js';
