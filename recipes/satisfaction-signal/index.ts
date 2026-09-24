import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  satisfactionSignalInputSchema,
  satisfactionSignalResultSchema,
  satisfactionSignalVerdictSchema,
} from './schema.js';
import type { SatisfactionSignalInput, SatisfactionSignalResult } from './schema.js';

export async function satisfactionSignal(
  input: SatisfactionSignalInput,
  options: RecipeOptions = {},
): Promise<SatisfactionSignalResult> {
  const { minConfidence = 0.8, ...state } = satisfactionSignalInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How much satisfaction with the outcome does message express at the close of an interaction, given any context? Judge the expressed wording only, not whether the issue was actually resolved.',
    [
      'The wording explicitly expresses dissatisfaction with the outcome.',
      'The wording expresses mild dissatisfaction or leaves a complaint unresolved.',
      'The wording is neutral or offers no evaluation of the outcome.',
      'The wording expresses mild satisfaction with the outcome.',
      'The wording explicitly expresses strong satisfaction or thanks for a resolved outcome.',
    ],
    options,
  );
  return satisfactionSignalResultSchema.parse({
    ...decision,
    satisfaction: satisfactionSignalVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  satisfactionSignalInputSchema,
  satisfactionSignalResultSchema,
  satisfactionSignalVerdictSchema,
} from './schema.js';
export type {
  SatisfactionSignalInput,
  SatisfactionSignalResult,
  SatisfactionSignalVerdict,
} from './schema.js';
