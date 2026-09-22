import { z } from 'zod';
import { decisionResponseSchema } from '../src/schema.js';
import { recipes } from './recipes.js';

const recipeNames = Object.keys(recipes) as [keyof typeof recipes, ...(keyof typeof recipes)[]];
export const recipeNameSchema = z.enum(recipeNames);

export const commandArgumentsSchema = z.union([
  z.tuple([z.enum(['--help', '-h'])]),
  z.tuple([z.literal('--version')]),
  z.tuple([z.literal('list')]),
  z.tuple([z.enum(['demo', 'example']), recipeNameSchema]),
  z.tuple([z.literal('run'), recipeNameSchema, z.string().min(1)]),
]);

export const demoFixtureSchema = z.object({
  input: z.unknown(),
  response: decisionResponseSchema,
});

export type RecipeName = z.infer<typeof recipeNameSchema>;
