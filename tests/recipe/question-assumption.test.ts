import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { questionAssumption } from '../../recipes/question-assumption/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = { question: 'Why did you delete the file?', claim: 'You deleted the file.' };
const verdicts = ['assumed', 'not_assumed', 'unclear'] as const;

testClassification(questionAssumption, input, verdicts, ['context']);

describe('question-assumption review policy', () => {
  it('keeps unclear in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      questionAssumption({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'unclear',
      confidence: 1,
      status: 'review',
    });
  });
  it('accepts a resolved verdict at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'assumed', 1));
    await expect(
      questionAssumption({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({
      verdict: 'assumed',
      confidence: 1,
      status: 'ready',
    });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(questionAssumption({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
