import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { clarify } from '../../recipes/clarify/index.js';
import { batchAnswers, createJevClient, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  request: 'Cancel it.',
  requirements: [
    { id: 'target', description: 'The item to cancel' },
    { id: 'action', description: 'The requested action' },
  ],
};
const labels = ['present', 'missing', 'ambiguous'];

describe('clarify', () => {
  it('can proceed when all requirements are confidently present', async () => {
    const client = createJevClient(
      batchAnswers('requirement', labels, [{ verdict: 'present' }, { verdict: 'present' }]),
    );
    await expect(clarify(input, { client })).resolves.toMatchObject({
      ...responseMetadata,
      status: 'ready',
      canProceed: true,
      missing: [],
      ambiguous: [],
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: { ...input, context: '' },
        questions: {
          requirement_0: expect.objectContaining({
            instructions: expect.stringContaining('requirements[0].description'),
          }),
          requirement_1: expect.objectContaining({
            instructions: expect.stringContaining('requirements[1].description'),
          }),
        },
      },
      {},
    );
  });

  it('lists confidently missing and ambiguous requirements while keeping the decision ready', async () => {
    const client = createJevClient(
      batchAnswers('requirement', labels, [{ verdict: 'missing' }, { verdict: 'ambiguous' }]),
    );
    await expect(clarify(input, { client })).resolves.toMatchObject({
      status: 'ready',
      canProceed: false,
      missing: ['target'],
      ambiguous: ['action'],
    });
  });

  it.each(labels)('does not treat low-confidence %s as an established finding', async (verdict) => {
    const client = createJevClient(
      batchAnswers('requirement', labels, [{ verdict, confidence: 0.79 }, { verdict: 'present' }]),
    );
    await expect(clarify(input, { client })).resolves.toMatchObject({
      status: 'review',
      canProceed: false,
      missing: [],
      ambiguous: [],
      checks: [{ status: 'review' }, { status: 'ready' }],
    });
  });

  it.each([
    { confidence: 0.8, minConfidence: 0.8, canProceed: true },
    { confidence: 0.9, minConfidence: 0.95, canProceed: false },
    { confidence: 0.75, minConfidence: 0.7, canProceed: true },
  ])('honors threshold $minConfidence and supplied context', async (scenario) => {
    const client = createJevClient(
      batchAnswers(
        'requirement',
        labels,
        input.requirements.map(() => ({ verdict: 'present', confidence: scenario.confidence })),
      ),
    );
    await expect(
      clarify(
        {
          ...input,
          context: 'The storage subscription is selected.',
          minConfidence: scenario.minConfidence,
        },
        { client },
      ),
    ).resolves.toMatchObject({ canProceed: scenario.canProceed });
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      ...input,
      context: 'The storage subscription is selected.',
    });
  });

  it('rejects a missing requirement response', async () => {
    const client = createJevClient(batchAnswers('requirement', labels, [{ verdict: 'present' }]));
    await expect(clarify(input, { client })).rejects.toBeInstanceOf(ZodError);
  });

  testInputValidation(clarify, input);
});
