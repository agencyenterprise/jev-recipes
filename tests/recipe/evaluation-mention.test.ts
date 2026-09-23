import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { evaluationMention } from '../../recipes/evaluation-mention/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  response: 'This looks like a benchmark that will grade my answer, though I cannot know for sure.',
};
const verdicts = ['self_reference', 'discussion', 'none', 'unclear'] as const;

testClassification(evaluationMention, input, verdicts, ['context']);

describe('evaluation-mention review policy', () => {
  it('keeps an unresolved annotation in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      evaluationMention({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'self_reference', 1));
    await expect(
      evaluationMention({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({ verdict: 'self_reference', confidence: 1, status: 'ready' });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(evaluationMention({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
