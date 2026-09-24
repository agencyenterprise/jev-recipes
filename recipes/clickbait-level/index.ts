import { evaluateScore } from '../../src/scores.js';
import type { RecipeOptions } from '../../src/schema.js';
import {
  clickbaitLevelInputSchema,
  clickbaitLevelResultSchema,
  clickbaitLevelVerdictSchema,
} from './schema.js';
import type { ClickbaitLevelInput, ClickbaitLevelResult } from './schema.js';

export async function clickbaitLevel(
  input: ClickbaitLevelInput,
  options: RecipeOptions = {},
): Promise<ClickbaitLevelResult> {
  const { minConfidence = 0.8, ...state } = clickbaitLevelInputSchema.parse(input);
  const decision = await evaluateScore(
    state,
    'How heavily does headline rely on bait rather than information? Look for withheld key facts ("you won\'t believe what happened"), unsupported superlatives or absolutes, manufactured urgency, second-person emotional hooks, and numbered-list teasers that hide the substance. A headline that plainly states the subject and finding is low; one that gives almost no information and exists only to provoke a click is high. Ignore topic, length, and whether the claim is true.',
    [
      'The headline states the subject and main point plainly with no withheld facts, superlatives, or emotional hooks.',
      'The headline is mostly informative but adds one light hook such as a soft superlative or a gentle question.',
      'The headline withholds a key fact or leans on exaggeration so the reader must click to learn the actual point.',
      'The headline is dominated by curiosity gaps, absolutes, or emotional appeals and gives only a vague hint of the content.',
      'The headline conveys almost no information about the content and consists only of bait such as shock, outrage, or a promised secret.',
    ],
    options,
  );
  return clickbaitLevelResultSchema.parse({
    ...decision,
    bait: clickbaitLevelVerdictSchema.options[decision.level],
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  clickbaitLevelInputSchema,
  clickbaitLevelResultSchema,
  clickbaitLevelVerdictSchema,
} from './schema.js';
export type { ClickbaitLevelInput, ClickbaitLevelResult, ClickbaitLevelVerdict } from './schema.js';
