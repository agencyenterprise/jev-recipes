import { readFileSync } from 'node:fs';
import type { RecipeMetadata } from '../src/schema.js';
import { recipeMetadata } from './generated/metadata.js';
import { recipeFiltersSchema, recipeNameSchema } from './schema.js';
import type { RecipeFilters, RecipeName } from './schema.js';
import { searchRecipes } from './search.js';

export type CatalogRecipe = RecipeMetadata & { id: RecipeName };
export type RecipeDescription = CatalogRecipe & {
  inputSchema: Record<string, unknown>;
  resultSchema: Record<string, unknown>;
};

export function listRecipes(filters: RecipeFilters = {}): CatalogRecipe[] {
  return structuredClone(searchRecipes(recipeMetadata, recipeFiltersSchema.parse(filters)));
}

export function describeRecipe(name: RecipeName): RecipeDescription {
  const id = recipeNameSchema.parse(name);
  const metadata = recipeMetadata.find((recipe) => recipe.id === id)!;
  const schemas = JSON.parse(
    readFileSync(new URL(`./generated/details/${id}.json`, import.meta.url), 'utf8'),
  ) as Pick<RecipeDescription, 'inputSchema' | 'resultSchema'>;
  return { ...structuredClone(metadata), ...schemas };
}

export { recipeFiltersSchema, recipeNameSchema } from './schema.js';
export { recipeCategorySchema, recipeMetadataSchema } from '../src/schema.js';
export type { RecipeFilters, RecipeName } from './schema.js';
export type { RecipeCategory, RecipeMetadata } from '../src/schema.js';
