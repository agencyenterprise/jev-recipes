import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { constraintStrength } from '../../recipes/constraint-strength/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  statement: 'Prefer a CSV export, but JSON is fine if that is easier.',
};
const verdicts = ['required', 'preferred', 'optional', 'unclear'] as const;

testClassification(constraintStrength, input, verdicts, ['context']);

describe('constraint-strength review boundaries', () => {
  it('keeps an unresolved decision in review even with maximum confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      constraintStrength({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });

  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(constraintStrength({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
