import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { instructionConflict } from '../../recipes/instruction-conflict/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  firstInstruction: 'Send the report as a PDF attachment.',
  secondInstruction:
    'Send the report only as plain text in the email body; do not attach any files.',
};
const verdicts = ['compatible', 'conflicting', 'different_scope', 'unclear'] as const;

testClassification(instructionConflict, input, verdicts, ['context']);

describe('instruction-conflict review boundaries', () => {
  it('keeps an unresolved decision in review even with maximum confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      instructionConflict({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });

  it.each(['', '   ', '\n\t'])(
    'rejects blank optional context %j before inference',
    async (context) => {
      const client = createJevClient();
      await expect(instructionConflict({ ...input, context }, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );
});
