import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { motivationSource } from '../../recipes/motivation-source/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  activity: 'Alex solves puzzles.',
  statement: 'Alex says: "I solve puzzles because I enjoy the challenge itself."',
};
const verdicts = ['intrinsic', 'extrinsic', 'mixed', 'not_stated', 'unclear'] as const;

testClassification(motivationSource, input, verdicts, ['context']);

describe('motivation-source review policy', () => {
  it('keeps unclear in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      motivationSource({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'unclear',
      confidence: 1,
      status: 'review',
    });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'intrinsic', 1));
    await expect(
      motivationSource({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'intrinsic',
      confidence: 1,
      status: 'ready',
    });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(motivationSource({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
