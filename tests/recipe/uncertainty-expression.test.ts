import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { uncertaintyExpression } from '../../recipes/uncertainty-expression/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  claim: 'The service outage was caused by the deployment.',
  response: 'The deployment probably caused the outage, but the logs do not rule out other causes.',
};
const verdicts = ['categorical', 'qualified', 'uncertain', 'not_addressed', 'unclear'] as const;

testClassification(uncertaintyExpression, input, verdicts, ['context']);

describe('uncertainty-expression review policy', () => {
  it('keeps an unresolved annotation in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      uncertaintyExpression({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'qualified', 1));
    await expect(
      uncertaintyExpression({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({ verdict: 'qualified', confidence: 1, status: 'ready' });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(uncertaintyExpression({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
  it('keeps expressed uncertainty separate from annotation uncertainty', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'uncertain', 1));
    const result = await uncertaintyExpression(
      {
        ...input,
        response: 'I cannot tell whether the deployment caused the outage.',
        minConfidence: 1,
      },
      { client },
    );
    expect(result).toMatchObject({ verdict: 'uncertain', confidence: 1, status: 'ready' });
  });
});
