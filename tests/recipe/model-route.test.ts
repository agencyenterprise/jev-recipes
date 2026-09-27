import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { modelRoute } from '../../recipes/model-route/index.js';
import { choiceAnswer, createJevClient, responseMetadata, scoreAnswer } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  request: 'Rename the variable usr to user in src/session.ts.',
  models: [
    { id: 'fast', text: 'Cheap and quick. Good for small edits.' },
    { id: 'frontier', text: 'Expensive. Best for architecture and hard debugging.' },
  ],
};
const labels = ['candidate_0', 'candidate_1', 'none', 'ambiguous'];

function answers(selected: string, level: number, confidence = 0.9, effortConfidence = 0.9) {
  return {
    decision: choiceAnswer(labels, selected, confidence),
    effort: scoreAnswer(3, level, effortConfidence),
  };
}

describe('modelRoute', () => {
  it('maps the selected candidate to the model id and reports effort in one request', async () => {
    const client = createJevClient(answers('candidate_0', 0));
    const result = await modelRoute(input, { client });
    expect(result).toEqual({
      ...responseMetadata,
      status: 'ready',
      verdict: 'matched',
      selection: 'fast',
      suggestedSelection: 'fast',
      confidence: 0.9,
      probabilities: {
        candidates: { fast: 0.9, frontier: expect.any(Number) },
        none: expect.any(Number),
        ambiguous: expect.any(Number),
      },
      effort: 'low',
      effortLevel: 0,
      effortScore: expect.any(Number),
      effortConfidence: 0.9,
      effortProbabilities: { '0': 0.9, '1': expect.any(Number), '2': expect.any(Number) },
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: input,
        questions: {
          decision: {
            type: 'choice',
            instructions: expect.stringContaining('Choose none when no candidate fits'),
            criteria: {
              candidate_0: input.models[0]!.text,
              candidate_1: input.models[1]!.text,
              none: expect.any(String),
              ambiguous: expect.any(String),
            },
          },
          effort: {
            type: 'score',
            instructions: expect.stringContaining('Score from 0 to 2'),
            criteria: [expect.any(String), expect.any(String), expect.any(String)],
          },
        },
      },
      {},
    );
  });

  it.each([
    [1, 'medium'],
    [2, 'high'],
  ])('maps effort level %s to %s', async (level, effort) => {
    const client = createJevClient(answers('candidate_1', level));
    await expect(modelRoute(input, { client })).resolves.toMatchObject({
      selection: 'frontier',
      effort,
      effortLevel: level,
    });
  });

  it('returns review for none, ambiguous, and low-confidence selections', async () => {
    await expect(
      modelRoute(input, { client: createJevClient(answers('none', 0)) }),
    ).resolves.toMatchObject({ status: 'ready', verdict: 'none', selection: null });
    await expect(
      modelRoute(input, { client: createJevClient(answers('ambiguous', 0)) }),
    ).resolves.toMatchObject({ status: 'review', verdict: 'ambiguous', selection: null });
    await expect(
      modelRoute(input, { client: createJevClient(answers('candidate_0', 0, 0.79)) }),
    ).resolves.toMatchObject({
      status: 'review',
      verdict: 'matched',
      selection: null,
      suggestedSelection: 'fast',
    });
  });

  it('does not gate on effort confidence but honors minConfidence for the selection', async () => {
    await expect(
      modelRoute(input, { client: createJevClient(answers('candidate_0', 0, 0.9, 0.4)) }),
    ).resolves.toMatchObject({ status: 'ready', effortConfidence: 0.4 });
    await expect(
      modelRoute(
        { ...input, minConfidence: 0.95 },
        { client: createJevClient(answers('candidate_0', 0, 0.9)) },
      ),
    ).resolves.toMatchObject({ status: 'review' });
  });

  it('forwards optional context, the model, and the abort signal', async () => {
    const signal = new AbortController().signal;
    const client = createJevClient(answers('candidate_0', 0));
    const configured = { ...input, context: 'Small TypeScript repository.' };
    await modelRoute(configured, { client, model: 'selected-model', signal });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ state: configured, model: 'selected-model' }),
      { signal },
    );
  });

  it('rejects a missing effort answer, an unknown candidate, and propagates provider errors', async () => {
    const { decision } = answers('candidate_0', 0);
    await expect(
      modelRoute(input, { client: createJevClient({ decision }) }),
    ).rejects.toBeInstanceOf(ZodError);
    const unknown = answers('candidate_0', 0);
    unknown.decision = { ...unknown.decision, choice: 'candidate_2' };
    await expect(modelRoute(input, { client: createJevClient(unknown) })).rejects.toBeInstanceOf(
      ZodError,
    );
    const failure = new Error('Provider unavailable');
    const client = createJevClient();
    client.systemOne.mockRejectedValue(failure);
    await expect(modelRoute(input, { client })).rejects.toBe(failure);
  });

  testInputValidation(modelRoute, input, ['context']);
});
