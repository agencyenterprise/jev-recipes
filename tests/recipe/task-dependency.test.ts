import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { taskDependency } from '../../recipes/task-dependency/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  firstTask: 'Build the release archive from the source code.',
  secondTask: 'Upload the completed release archive to the artifact store.',
};
const verdicts = [
  'first_before_second',
  'second_before_first',
  'independent',
  'cyclic',
  'unclear',
] as const;

testClassification(taskDependency, input, verdicts, ['context']);

describe('task-dependency review boundaries', () => {
  it('keeps an unresolved decision in review even with maximum confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(taskDependency({ ...input, minConfidence: 0 }, { client })).resolves.toMatchObject(
      { verdict: 'unclear', confidence: 1, status: 'review' },
    );
  });

  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(taskDependency({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
