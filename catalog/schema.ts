import { z } from 'zod';
import { nonEmptyText, recipeCategorySchema } from '../src/schema.js';
import { recipeNames } from './generated/names.js';

export const recipeNameSchema = z.enum(recipeNames);
export const recipeFiltersSchema = z.object({
  query: nonEmptyText.optional(),
  category: recipeCategorySchema.optional(),
  limit: z.number().int().positive().optional(),
});
export type RecipeName = z.infer<typeof recipeNameSchema>;
export type RecipeFilters = z.infer<typeof recipeFiltersSchema>;
