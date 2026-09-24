import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { progressStallInputSchema, progressStallResultSchema } from './schema.js';
import type { ProgressStallInput, ProgressStallResult } from './schema.js';

export async function progressStall(
  input: ProgressStallInput,
  options: RecipeOptions = {},
): Promise<ProgressStallResult> {
  const { minConfidence = 0.8, ...state } = progressStallInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Does transcript, the recent steps an agent has taken, show the agent failing to make progress toward objective? Count a stall when the agent repeats the same or near-identical actions, cycles between a small set of states, re-reads or re-derives information it already has, or keeps hitting the same error without changing approach. Do not count a stall when each step adds new information, narrows the problem, or tries a materially different approach, even if objective is not yet reached.',
    {
      true: 'The recent steps repeat, circle, or reprocess the same information without moving toward the objective.',
      false:
        'The recent steps each add information or change approach in a way that moves toward the objective.',
    },
    options,
  );
  return progressStallResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'stalled' : 'progressing',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  progressStallInputSchema,
  progressStallResultSchema,
  progressStallVerdictSchema,
} from './schema.js';
export type { ProgressStallInput, ProgressStallResult, ProgressStallVerdict } from './schema.js';
