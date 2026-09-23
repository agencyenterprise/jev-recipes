import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { issueRecurrence } from '../../recipes/issue-recurrence/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  issue: 'CSV export fails with error E42.',
  message: 'The same E42 error is back when I export a CSV.',
};
const verdicts = ['new', 'ongoing', 'returned', 'unclear'] as const;

testClassification(issueRecurrence, input, verdicts, ['history']);

describe('issue-recurrence review policy', () => {
  it('keeps unclear in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      issueRecurrence({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'unclear',
      confidence: 1,
      status: 'review',
    });
  });
  it('accepts a resolved verdict at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'returned', 1));
    await expect(
      issueRecurrence({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'returned',
      confidence: 1,
      status: 'ready',
    });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional history %j before inference',
    async (history) => {
      const client = createJevClient();
      await expect(issueRecurrence({ ...input, history }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
