import type { RecipeOptions } from '../src/schema.js';
import { recipeLoaders } from './generated/loaders.js';
import { recipeNameSchema } from './schema.js';
import type { RecipeName } from './schema.js';

export type RecipeRunner = (input: unknown, options?: RecipeOptions) => Promise<unknown>;

export function loadRecipe(name: RecipeName): Promise<RecipeRunner> {
  return recipeLoaders[recipeNameSchema.parse(name)]();
}
