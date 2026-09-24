import { evaluateChoice } from '../../src/decisions.js';
import type { RecipeOptions } from '../../src/schema.js';
import { searchIntentKindInputSchema, searchIntentKindResultSchema } from './schema.js';
import type { SearchIntentKindInput, SearchIntentKindResult } from './schema.js';

export async function searchIntentKind(
  input: SearchIntentKindInput,
  options: RecipeOptions = {},
): Promise<SearchIntentKindResult> {
  const { minConfidence = 0.8, ...state } = searchIntentKindInputSchema.parse(input);
  const decision = await evaluateChoice(
    state,
    'What is the searcher trying to do with query? Informational queries seek an explanation, fact, or how-to. Navigational queries name a specific site, brand, or page the searcher wants to reach. Transactional queries show readiness to buy, download, sign up, or otherwise act now. Commercial queries compare options or research a purchase before committing. Local queries seek something in a physical place near the searcher. Use unclear when the query is too short or generic to favor one of these.',
    {
      informational:
        'The query asks for an explanation, definition, fact, or instructions and does not name a product to acquire or a place to go.',
      navigational:
        'The query names a specific website, brand, app, or page and the searcher clearly wants to reach it.',
      transactional:
        'The query expresses readiness to buy, order, download, book, or sign up now, often with words like buy, price, coupon, or download.',
      commercial:
        'The query compares products or services or seeks reviews, alternatives, or the best option before a purchase decision.',
      local:
        'The query seeks a business, service, or place in a physical area, using near me, a city, or a neighborhood.',
      unclear: 'The query is too short, generic, or ambiguous to favor one intent.',
    },
    options,
  );
  return searchIntentKindResultSchema.parse({
    ...decision,
    status:
      decision.confidence < minConfidence || decision.verdict === 'unclear' ? 'review' : 'ready',
  });
}

export {
  searchIntentKindInputSchema,
  searchIntentKindResultSchema,
  searchIntentKindVerdictSchema,
} from './schema.js';
export type {
  SearchIntentKindInput,
  SearchIntentKindResult,
  SearchIntentKindVerdict,
} from './schema.js';
