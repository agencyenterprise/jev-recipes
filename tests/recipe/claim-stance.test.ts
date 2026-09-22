import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { claimStance } from '../../recipes/claim-stance/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  claim: 'The report says all tests passed.',
  response: 'No. The report lists two failing tests.',
};
const verdicts = ['affirms', 'denies', 'mixed', 'not_addressed', 'unclear'] as const;

testClassification(claimStance, input, verdicts, ['context']);

describe('claim-stance review boundaries', () => {
  it('keeps an unresolved decision in review even with maximum confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(claimStance({ ...input, minConfidence: 0 }, { client })).resolves.toMatchObject({
      verdict: 'unclear',
      confidence: 1,
      status: 'review',
    });
  });

  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(claimStance({ ...input, context }, { client })).rejects.toBeInstanceOf(ZodError);
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
