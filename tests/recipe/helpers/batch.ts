import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import type { RecipeOptions, TextItem } from '../../../src/schema.js';
import { batchAnswers, createJevClient, responseMetadata } from './jev.js';
import { testInputValidation } from './validation.js';

export function testBatch<Input extends Record<string, unknown>>(
  run: (
    input: Input,
    options?: RecipeOptions,
  ) => Promise<{
    status: string;
    checks: { id: string; status: string; verdict: string }[];
  }>,
  input: Input,
  itemField: keyof Input & string,
  verdicts: readonly string[],
  passingVerdict: string,
  aggregateField: string,
) {
  describe(run.name, () => {
    const items = input[itemField] as TextItem[];

    it.each(verdicts)(
      'returns one %s result per item and the correct aggregate',
      async (verdict) => {
        const answers = batchAnswers(
          'check',
          verdicts,
          items.map(() => ({ verdict })),
        );
        const client = createJevClient(answers);
        const result = await run(input, { client });
        expect(result).toEqual({
          ...responseMetadata,
          status: verdict === 'unclear' ? 'review' : 'ready',
          [aggregateField]: verdict === passingVerdict,
          checks: items.map((item, index) => ({
            id: item.id,
            verdict,
            status: verdict === 'unclear' ? 'review' : 'ready',
            confidence: answers['check_' + index]!.confidence,
            probabilities: answers['check_' + index]!.probabilities,
          })),
        });
        expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
          {
            state: input,
            questions: Object.fromEntries(
              items.map((_, index) => [
                'check_' + index,
                {
                  type: 'choice',
                  instructions: expect.stringContaining(itemField + '[' + index + '].text'),
                  criteria: Object.fromEntries(
                    verdicts.map((label) => [label, expect.any(String)]),
                  ),
                },
              ]),
            ),
          },
          {},
        );
      },
    );

    it('preserves item order and fails the aggregate when only one item fails', async () => {
      const client = createJevClient(
        batchAnswers('check', verdicts, [{ verdict: passingVerdict }, { verdict: verdicts[1]! }]),
      );
      const result = await run(input, { client });
      expect(result).toMatchObject({ status: 'ready', [aggregateField]: false });
      expect(result.checks).toMatchObject([
        { id: items[0]!.id, verdict: passingVerdict, status: 'ready' },
        { id: items[1]!.id, verdict: verdicts[1], status: 'ready' },
      ]);
    });

    it('requires review if even one passing verdict is below the default threshold', async () => {
      const client = createJevClient(
        batchAnswers('check', verdicts, [
          { verdict: passingVerdict },
          { verdict: passingVerdict, confidence: 0.79 },
        ]),
      );
      const result = await run(input, { client });
      expect(result).toMatchObject({ status: 'review', [aggregateField]: false });
      expect(result.checks.map((check) => check.status)).toEqual(['ready', 'review']);
    });

    it.each([
      { confidence: 0.8, minConfidence: 0.8, status: 'ready', passes: true },
      { confidence: 0.9, minConfidence: 0.95, status: 'review', passes: false },
      { confidence: 0.75, minConfidence: 0.7, status: 'ready', passes: true },
    ])('applies threshold $minConfidence to every item', async (scenario) => {
      const client = createJevClient(
        batchAnswers(
          'check',
          verdicts,
          items.map(() => ({ verdict: passingVerdict, confidence: scenario.confidence })),
        ),
      );
      await expect(
        run({ ...input, minConfidence: scenario.minConfidence }, { client }),
      ).resolves.toMatchObject({ status: scenario.status, [aggregateField]: scenario.passes });
      expect(client.systemOne.mock.calls[0]?.[0].state).toEqual(input);
    });

    it('rejects a partially missing batch instead of returning partial success', async () => {
      const client = createJevClient(
        batchAnswers('check', verdicts, [{ verdict: passingVerdict }]),
      );
      await expect(run(input, { client })).rejects.toBeInstanceOf(ZodError);
    });

    testInputValidation(run, input);
  });
}
