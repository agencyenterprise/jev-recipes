import { z } from 'zod';
import { recipeMetadataSchema } from '../src/schema.js';
import type { RecipeMetadata } from '../src/schema.js';
import { recipes } from './recipes.js';
import { recipeFiltersSchema, recipeNameSchema } from './schema.js';
import type { RecipeFilters, RecipeName } from './schema.js';

export function listRecipes(filters: RecipeFilters = {}) {
  const { query, category } = recipeFiltersSchema.parse(filters);
  const searchTerms = query?.toLowerCase().trim().split(/\s+/) ?? [];

  return Object.entries(recipes)
    .map(([id, recipe]) => ({
      ...recipeMetadataSchema.parse(recipe.metadata),
      id: recipeNameSchema.parse(id),
    }))
    .filter((recipe) => category === undefined || recipe.category === category)
    .filter((recipe) => matchesSearch(recipe, searchTerms));
}

export function describeRecipe(name: RecipeName) {
  const recipe = recipes[recipeNameSchema.parse(name)];
  return {
    ...recipeMetadataSchema.parse(recipe.metadata),
    inputSchema: z.toJSONSchema(recipe.inputSchema, { io: 'input' }),
    resultSchema: z.toJSONSchema(recipe.resultSchema),
  };
}

function matchesSearch(recipe: RecipeMetadata, terms: string[]): boolean {
  const text = [recipe.id, recipe.title, recipe.description, recipe.category, ...recipe.tags]
    .join(' ')
    .toLowerCase();
  return terms.every((term) => text.includes(term));
}

export { recipeFiltersSchema, recipeNameSchema } from './schema.js';
export { recipeCategorySchema, recipeMetadataSchema } from '../src/schema.js';
export type { RecipeFilters, RecipeName } from './schema.js';
export type { RecipeCategory, RecipeMetadata } from '../src/schema.js';
