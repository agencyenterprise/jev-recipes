import { z } from 'zod';
import { decisionResponseSchema, nonEmptyText, recipeCategorySchema } from '../src/schema.js';
import { recipeNameSchema } from '../catalog/schema.js';

const searchQuery = nonEmptyText.refine(
  (query) => !query.startsWith('--'),
  'Expected a search query.',
);
export const commandArgumentsSchema = z.union([
  z.tuple([z.enum(['--help', '-h'])]),
  z.tuple([z.literal('--version')]),
  z.tuple([z.literal('list')]),
  z.tuple([z.literal('list'), searchQuery]),
  z.tuple([z.literal('list'), z.literal('--category'), recipeCategorySchema]),
  z.tuple([z.literal('list'), searchQuery, z.literal('--category'), recipeCategorySchema]),
  z.tuple([z.literal('demo'), z.union([recipeNameSchema, z.literal('all')])]),
  z.tuple([z.enum(['example', 'describe']), recipeNameSchema]),
  z.tuple([z.literal('run'), recipeNameSchema, nonEmptyText]),
]);
export const demoFixtureSchema = z.object({ input: z.unknown(), response: decisionResponseSchema });
