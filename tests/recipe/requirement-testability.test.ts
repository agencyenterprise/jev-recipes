import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { requirementTestability } from '../../recipes/requirement-testability/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  requirement: 'The dashboard should load quickly.',
};
const verdicts = ['testable', 'not_testable', 'unclear'] as const;

testClassification(requirementTestability, input, verdicts, ['context']);

describe('requirement-testability review boundaries', () => {
  it('keeps an unresolved decision in review even with maximum confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      requirementTestability({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });

  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(
        requirementTestability({ ...input, context }, { client }),
      ).rejects.toBeInstanceOf(ZodError);
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
