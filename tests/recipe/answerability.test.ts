import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { answerability } from '../../recipes/answerability/index.js';
import { choiceAnswers, createJevClient, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  question: 'Can guests export reports?',
  evidence: [{ id: 'policy', text: 'Guests can view reports but cannot export them.' }],
};
const labels = ['sufficient', 'partial', 'insufficient', 'conflicting'];

describe('answerability', () => {
  it.each(labels)(
    'returns %s and only permits answering with sufficient evidence',
    async (verdict) => {
      const answers = choiceAnswers('answerability', labels, verdict);
      const client = createJevClient(answers);
      await expect(answerability(input, { client })).resolves.toEqual({
        ...responseMetadata,
        verdict,
        status: 'ready',
        canAnswer: verdict === 'sufficient',
        confidence: 0.9,
        probabilities: answers.answerability!.probabilities,
      });
      expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
        {
          state: input,
          questions: {
            answerability: expect.objectContaining({
              type: 'choice',
              criteria: Object.fromEntries(labels.map((label) => [label, expect.any(String)])),
            }),
          },
        },
        {},
      );
    },
  );

  it('does not permit answering from a low-confidence sufficient verdict', async () => {
    const client = createJevClient(choiceAnswers('answerability', labels, 'sufficient', 0.79));
    await expect(answerability(input, { client })).resolves.toMatchObject({
      status: 'review',
      canAnswer: false,
      verdict: 'sufficient',
    });
  });

  it.each([
    { confidence: 0.8, minConfidence: 0.8, canAnswer: true },
    { confidence: 0.9, minConfidence: 0.95, canAnswer: false },
    { confidence: 0.75, minConfidence: 0.7, canAnswer: true },
  ])('applies threshold $minConfidence to the answer decision', async (scenario) => {
    const client = createJevClient(
      choiceAnswers('answerability', labels, 'sufficient', scenario.confidence),
    );
    await expect(
      answerability({ ...input, minConfidence: scenario.minConfidence }, { client }),
    ).resolves.toMatchObject({ canAnswer: scenario.canAnswer });
  });

  it('rejects a missing answerability response', async () => {
    await expect(answerability(input, { client: createJevClient() })).rejects.toBeInstanceOf(
      ZodError,
    );
  });

  testInputValidation(answerability, input);
});
