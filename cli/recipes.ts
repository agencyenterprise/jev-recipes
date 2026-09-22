import { route } from '../recipes/route/index.js';
import { routeInputSchema } from '../recipes/route/schema.js';
import { rerank } from '../recipes/rerank/index.js';
import { rerankInputSchema } from '../recipes/rerank/schema.js';
import { verify } from '../recipes/verify/index.js';
import { verifyInputSchema } from '../recipes/verify/schema.js';
import type { RecipeOptions } from '../src/schema.js';

export const recipes = {
  route: {
    description: 'Choose a handler or request review.',
    run: (input: unknown, options?: RecipeOptions) => route(routeInputSchema.parse(input), options),
  },
  rerank: {
    description: 'Rank passages by relevance to a query.',
    run: (input: unknown, options?: RecipeOptions) =>
      rerank(rerankInputSchema.parse(input), options),
  },
  verify: {
    description: 'Check claims against supplied evidence.',
    run: (input: unknown, options?: RecipeOptions) =>
      verify(verifyInputSchema.parse(input), options),
  },
};
