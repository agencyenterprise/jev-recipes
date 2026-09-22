import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { taskDuplicate } from '../../recipes/task-duplicate/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  firstTask: 'Write a summary of the supplied onboarding guide for new hires.',
  secondTask:
    'Summarize the same supplied onboarding guide for new hires and translate the summary into Spanish.',
};
const verdicts = ['duplicate', 'overlapping', 'distinct', 'unclear'] as const;

testClassification(taskDuplicate, input, verdicts, ['context']);

describe('task-duplicate review boundaries', () => {
  it('keeps an unresolved decision in review even with maximum confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(taskDuplicate({ ...input, minConfidence: 0 }, { client })).resolves.toMatchObject({
      verdict: 'unclear',
      confidence: 1,
      status: 'review',
    });
  });

  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(taskDuplicate({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
