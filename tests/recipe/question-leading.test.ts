import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { questionLeading } from '../../recipes/question-leading/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  question: "Surely you agree the new layout is easier to use, don't you?",
  proposedAnswer: 'The new layout is easier to use.',
};
const verdicts = ['favors', 'disfavors', 'neutral', 'unclear'] as const;

testClassification(questionLeading, input, verdicts, ['context']);

describe('question-leading review policy', () => {
  it('keeps an unresolved annotation in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      questionLeading({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'favors', 1));
    await expect(
      questionLeading({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({ verdict: 'favors', confidence: 1, status: 'ready' });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(questionLeading({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
