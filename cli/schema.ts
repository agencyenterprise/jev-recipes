import { z } from 'zod';
import { decisionResponseSchema, nonEmptyText, recipeCategorySchema } from '../src/schema.js';
import { recipeNameSchema } from '../catalog/schema.js';

const searchQuery = nonEmptyText.refine(
  (query) => !query.startsWith('--'),
  'Expected a search query.',
);
const limitArgument = z
  .string()
  .regex(/^[1-9]\d*$/)
  .refine((value) => Number.isSafeInteger(Number(value)), 'Expected a positive whole number.');
const listArguments = z
  .array(z.string())
  .superRefine((args, context) => {
    if (args[0] !== 'list') {
      context.addIssue({ code: 'custom', message: 'Expected list.' });
      return;
    }
    let index = 1;
    if (args[index] !== undefined && !args[index]!.startsWith('--')) {
      if (!searchQuery.safeParse(args[index]).success)
        context.addIssue({ code: 'custom', message: 'Expected a search query.' });
      index++;
    }
    const seen = new Set<string>();
    while (index < args.length) {
      const flag = args[index]!;
      const value = args[index + 1];
      const valid =
        flag === '--category'
          ? recipeCategorySchema.safeParse(value).success
          : flag === '--limit' && limitArgument.safeParse(value).success;
      if (!valid || seen.has(flag)) {
        context.addIssue({
          code: 'custom',
          message: 'Expected --category <category> or --limit <count>, once each.',
        });
        return;
      }
      seen.add(flag);
      index += 2;
    }
  })
  .transform((args) => args as ['list', ...string[]]);
export const commandArgumentsSchema = z.union([
  z.tuple([z.enum(['--help', '-h'])]),
  z.tuple([z.literal('--version')]),
  listArguments,
  z.tuple([z.literal('demo'), z.union([recipeNameSchema, z.literal('all')])]),
  z.tuple([z.enum(['example', 'describe']), recipeNameSchema]),
  z.tuple([z.literal('run'), recipeNameSchema, nonEmptyText]),
]);
export const demoFixtureSchema = z.object({ input: z.unknown(), response: decisionResponseSchema });
