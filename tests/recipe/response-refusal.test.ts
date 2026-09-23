import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { responseRefusal } from '../../recipes/response-refusal/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  request: 'Summarize the attached report.',
  response: 'I cannot access the attachment. Paste the report text so I can summarize it.',
};
const verdicts = ['refused', 'attempted', 'mixed', 'unable', 'not_addressed', 'unclear'] as const;

testClassification(responseRefusal, input, verdicts, ['context']);

describe('response-refusal review policy', () => {
  it('keeps an unresolved annotation in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      responseRefusal({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unable', 1));
    await expect(
      responseRefusal({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unable', confidence: 1, status: 'ready' });
  });
  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(responseRefusal({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
