import { noul } from '@typesafe-ai/sdk';
import { evaluateWithJev } from '../../src/client.js';
import { parseYesProbability } from '../../src/answers.js';
import { asDecisionInstruction, parseDecisionState } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { contextPruneInputSchema, contextPruneResultSchema } from './schema.js';
import type { ContextPruneInput, ContextPruneResult } from './schema.js';

export async function contextPrune(
  input: ContextPruneInput,
  options: RecipeOptions = {},
): Promise<ContextPruneResult> {
  const { minConfidence = 0.8, ...state } = contextPruneInputSchema.parse(input);
  const response = await evaluateWithJev(
    {
      state: parseDecisionState(state),
      questions: Object.fromEntries(
        state.items.map((_, index) => [
          `item_${index}`,
          noul(
            asDecisionInstruction(
              `Will items[${index}].text still be needed to finish objective? Count it needed when it holds facts, results, decisions, errors, or user instructions the remaining work depends on, or when it is the only record of something that must not be redone. Do not count it needed merely because it was useful earlier, is long, or is recent; use recent, when supplied, for what has already been handled. Judge only this item.`,
            ),
            {
              true: 'The remaining work depends on this item.',
              false: 'The remaining work can proceed without this item.',
            },
          ),
        ]),
      ),
    },
    options,
  );
  const items = state.items.map((item, index) => {
    const probability = parseYesProbability(response.answers[`item_${index}`]);
    const confidence = Math.max(probability, 1 - probability);
    return {
      id: item.id,
      status: confidence < minConfidence ? 'review' : 'ready',
      verdict: probability >= 0.5 ? 'keep' : 'drop',
      probability,
      confidence,
    };
  });
  const drop = items
    .filter((item) => item.status === 'ready' && item.verdict === 'drop')
    .map((item) => item.id);
  return contextPruneResultSchema.parse({
    status: items.some((item) => item.status === 'review') ? 'review' : 'ready',
    items,
    keep: items.filter((item) => !drop.includes(item.id)).map((item) => item.id),
    drop,
    evaluated: items.length,
    model: response.model,
    usage: response.usage,
  });
}

export {
  contextPruneInputSchema,
  contextPruneResultSchema,
  contextPruneItemSchema,
  contextPruneVerdictSchema,
} from './schema.js';
export type {
  ContextPruneInput,
  ContextPruneResult,
  ContextPruneItem,
  ContextPruneVerdict,
} from './schema.js';
