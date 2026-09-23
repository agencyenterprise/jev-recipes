import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { outcomeFraming } from '../../recipes/outcome-framing/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  text: 'You keep 80 of your 100 points.',
  outcome: "The player's points after the round; more points are better.",
};
const verdicts = ['gain', 'loss', 'mixed', 'neutral', 'unclear'] as const;

testClassification(outcomeFraming, input, verdicts, ['context']);

describe('outcome-framing review policy', () => {
  it('keeps unclear in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(outcomeFraming({ ...input, minConfidence: 0 }, { client })).resolves.toMatchObject(
      {
        verdict: 'unclear',
        confidence: 1,
        status: 'review',
      },
    );
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'gain', 1));
    await expect(outcomeFraming({ ...input, minConfidence: 1 }, { client })).resolves.toMatchObject(
      {
        verdict: 'gain',
        confidence: 1,
        status: 'ready',
      },
    );
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(outcomeFraming({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
