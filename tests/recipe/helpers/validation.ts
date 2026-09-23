import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import type { RecipeOptions } from '../../../src/schema.js';
import { createJevClient } from './jev.js';

export function testInputValidation<Input extends Record<string, unknown>, Result>(
  run: (input: Input, options?: RecipeOptions) => Promise<Result>,
  input: Input,
  optionalFields: readonly string[] = [],
  itemLimit: number | null = 50,
  confidenceField = 'minConfidence',
) {
  describe('input validation', () => {
    it('rejects missing input before creating a client', async () => {
      await expect(run({} as Input)).rejects.toBeInstanceOf(ZodError);
    });

    for (const [field, value] of Object.entries(input)) {
      if (!optionalFields.includes(field)) {
        it('rejects a missing ' + field + ' before calling Jev', async () => {
          const invalid = { ...input };
          delete invalid[field];
          const client = createJevClient();
          await expect(run(invalid, { client })).rejects.toBeInstanceOf(ZodError);
          expect(client.systemOne).not.toHaveBeenCalled();
        });
      }

      if (typeof value === 'string') {
        it('rejects whitespace-only ' + field, async () => {
          const client = createJevClient();
          await expect(run({ ...input, [field]: '   ' }, { client })).rejects.toBeInstanceOf(
            ZodError,
          );
          expect(client.systemOne).not.toHaveBeenCalled();
        });
      }

      if (Array.isArray(value)) {
        const invalidItems: [string, unknown[]][] = [
          ['empty', []],
          ['duplicate IDs', [value[0], value[0]]],
          ['blank item ID', [{ ...value[0], id: ' ' }]],
        ];
        if (itemLimit !== null) {
          invalidItems.push([
            'too many items',
            Array.from({ length: itemLimit + 1 }, (_, index) => ({
              ...value[0],
              id: String(index),
            })),
          ]);
        }
        it.each(invalidItems)('rejects ' + field + ' with %s', async (_, items) => {
          const client = createJevClient();
          await expect(run({ ...input, [field]: items }, { client })).rejects.toBeInstanceOf(
            ZodError,
          );
          expect(client.systemOne).not.toHaveBeenCalled();
        });
      }
    }

    it.each([-0.01, 1.01, Number.NaN])(
      'rejects ' + confidenceField + ' %s',
      async (minConfidence) => {
        const client = createJevClient();
        await expect(
          run({ ...input, [confidenceField]: minConfidence }, { client }),
        ).rejects.toBeInstanceOf(ZodError);
        expect(client.systemOne).not.toHaveBeenCalled();
      },
    );
  });
}
