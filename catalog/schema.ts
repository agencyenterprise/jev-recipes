import { z } from 'zod';
import { nonEmptyText, recipeCategorySchema } from '../src/schema.js';
import { recipes } from './recipes.js';

const recipeNames = Object.keys(recipes) as [keyof typeof recipes, ...(keyof typeof recipes)[]];
export const recipeNameSchema = z.enum(recipeNames);
export const recipeFiltersSchema = z.object({
  query: nonEmptyText.optional(),
  category: recipeCategorySchema.optional(),
});
export type RecipeName = z.infer<typeof recipeNameSchema>;
export type RecipeFilters = z.infer<typeof recipeFiltersSchema>;
