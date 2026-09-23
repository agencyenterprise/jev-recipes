import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { memorySubject } from '../../recipes/memory-subject/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  statement: 'My brother is vegetarian.',
  user: 'Alex, the speaker of the statement.',
};
const verdicts = ['user', 'other', 'shared', 'unclear'] as const;

testClassification(memorySubject, input, verdicts, ['context']);

describe('memory-subject review policy', () => {
  it('keeps unclear in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(memorySubject({ ...input, minConfidence: 0 }, { client })).resolves.toMatchObject({
      verdict: 'unclear',
      confidence: 1,
      status: 'review',
    });
  });
  it('accepts a resolved verdict at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'other', 1));
    await expect(memorySubject({ ...input, minConfidence: 1 }, { client })).resolves.toMatchObject({
      verdict: 'other',
      confidence: 1,
      status: 'ready',
    });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(memorySubject({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
