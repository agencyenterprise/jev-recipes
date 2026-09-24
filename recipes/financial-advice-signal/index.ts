import { evaluateGate } from '../../src/gates.js';
import type { RecipeOptions } from '../../src/schema.js';
import { financialAdviceSignalInputSchema, financialAdviceSignalResultSchema } from './schema.js';
import type { FinancialAdviceSignalInput, FinancialAdviceSignalResult } from './schema.js';

export async function financialAdviceSignal(
  input: FinancialAdviceSignalInput,
  options: RecipeOptions = {},
): Promise<FinancialAdviceSignalResult> {
  const { minConfidence = 0.8, ...state } = financialAdviceSignalInputSchema.parse(input);
  const decision = await evaluateGate(
    state,
    'Read the text and decide whether it gives a specific recommendation about what the reader should do with money: buy, sell, hold, or allocate to a particular asset, fund, account type, or strategy. General explanation of how instruments work, historical facts, definitions, and descriptions of options without steering the reader do not count. Judge the wording as written, not whether the recommendation is good.',
    {
      true: 'The text tells or clearly steers the reader to take a specific action with their money, such as buying, selling, holding, or moving funds into a named asset, fund, account, or strategy.',
      false:
        'The text explains concepts, lists options, or states facts without directing the reader toward a specific action with their money.',
    },
    options,
  );
  return financialAdviceSignalResultSchema.parse({
    ...decision,
    verdict: decision.probability >= 0.5 ? 'advice' : 'informational',
    status: decision.confidence < minConfidence ? 'review' : 'ready',
  });
}

export {
  financialAdviceSignalInputSchema,
  financialAdviceSignalResultSchema,
  financialAdviceSignalVerdictSchema,
} from './schema.js';
export type {
  FinancialAdviceSignalInput,
  FinancialAdviceSignalResult,
  FinancialAdviceSignalVerdict,
} from './schema.js';
