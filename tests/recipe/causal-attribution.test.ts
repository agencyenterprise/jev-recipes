import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { causalAttribution } from '../../recipes/causal-attribution/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  behavior: 'Alex arrived late to the meeting.',
  explanation: 'Alex arrived late because the train was cancelled.',
};
const verdicts = ['personal', 'situational', 'mixed', 'none', 'unclear'] as const;

testClassification(causalAttribution, input, verdicts, ['context']);

describe('causal-attribution review policy', () => {
  it('keeps unclear in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      causalAttribution({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'unclear',
      confidence: 1,
      status: 'review',
    });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'situational', 1));
    await expect(
      causalAttribution({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'situational',
      confidence: 1,
      status: 'ready',
    });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(causalAttribution({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
