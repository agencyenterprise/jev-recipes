import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { expenseCategoryInputSchema, expenseCategoryResultSchema } from './schema.js';
import type { ExpenseCategoryInput, ExpenseCategoryResult } from './schema.js';

export async function expenseCategory(
  input: ExpenseCategoryInput,
  options: RecipeOptions = {},
): Promise<ExpenseCategoryResult> {
  const { minConfidence = 0.8, ...state } = expenseCategoryInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'Read the expense description and the list of categories, where each category has a name and a one-line definition. Decide whether the expense clearly falls under exactly one listed category, under more than one category equally well, under none of them, or whether the description is too vague to tell. Judge only the described purchase against the written definitions; ignore the amount and whether the expense seems reasonable.',
    {
      matched:
        'Exactly one listed category definition clearly covers the described expense, and no other listed definition fits it as well.',
      multiple:
        'Two or more listed category definitions cover the described expense about equally well, so the list alone cannot pick one.',
      none: 'The expense is described clearly enough to judge, and no listed category definition covers it.',
      unclear:
        'The expense description is too vague or incomplete to tell which, if any, category definition applies.',
    },
    options,
  );
  return expenseCategoryResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  expenseCategoryInputSchema,
  expenseCategoryResultSchema,
  expenseCategoryVerdictSchema,
} from './schema.js';
export type {
  ExpenseCategoryInput,
  ExpenseCategoryResult,
  ExpenseCategoryVerdict,
} from './schema.js';
