import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { contextPrune } from '../../recipes/context-prune/index.js';
import { createJevClient, noulAnswer, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  objective: 'Fix the failing auth test, run the suite, and commit.',
  items: [
    { id: 'ls', text: 'Tool result (ls): README.md src tests' },
    { id: 'source', text: 'Tool result (cat src/auth.ts): export function verify() {}' },
    { id: 'test-output', text: 'Tool result (npm test): FAIL tests/auth.test.ts expected 401' },
  ],
};

function answers(probabilities: number[]) {
  return Object.fromEntries(
    probabilities.map((probability, index) => [`item_${index}`, noulAnswer(probability)]),
  );
}

describe('contextPrune', () => {
  it('drops confident unnecessary items and keeps the rest in input order', async () => {
    const client = createJevClient(answers([0.05, 0.9, 0.95]));
    await expect(contextPrune(input, { client })).resolves.toEqual({
      ...responseMetadata,
      status: 'ready',
      items: [
        { id: 'ls', status: 'ready', verdict: 'drop', probability: 0.05, confidence: 0.95 },
        { id: 'source', status: 'ready', verdict: 'keep', probability: 0.9, confidence: 0.9 },
        {
          id: 'test-output',
          status: 'ready',
          verdict: 'keep',
          probability: 0.95,
          confidence: 0.95,
        },
      ],
      keep: ['source', 'test-output'],
      drop: ['ls'],
      evaluated: 3,
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: input,
        questions: {
          item_0: {
            type: 'noul',
            instructions: expect.stringContaining('items[0].text'),
            criteria: { true: expect.any(String), false: expect.any(String) },
          },
          item_1: expect.objectContaining({
            instructions: expect.stringContaining('items[1].text'),
          }),
          item_2: expect.objectContaining({
            instructions: expect.stringContaining('items[2].text'),
          }),
        },
      },
      {},
    );
  });

  it('keeps uncertain items, even when leaning drop, and reports review', async () => {
    const client = createJevClient(answers([0.3, 0.9, 0.95]));
    const result = await contextPrune(input, { client });
    expect(result.status).toBe('review');
    expect(result.items[0]).toMatchObject({ status: 'review', verdict: 'drop', confidence: 0.7 });
    expect(result.keep).toEqual(['ls', 'source', 'test-output']);
    expect(result.drop).toEqual([]);
  });

  it('honors a custom threshold and the 0.5 verdict boundary', async () => {
    const client = createJevClient(answers([0.3, 0.5, 0.95]));
    const result = await contextPrune({ ...input, minConfidence: 0.7 }, { client });
    expect(result.items.map((item) => item.verdict)).toEqual(['drop', 'keep', 'keep']);
    expect(result.items.map((item) => item.status)).toEqual(['ready', 'review', 'ready']);
    expect(result.drop).toEqual(['ls']);
  });

  it('forwards optional recent, the model, and the abort signal', async () => {
    const signal = new AbortController().signal;
    const client = createJevClient(answers([0.1, 0.9, 0.9]));
    const configured = { ...input, recent: 'The agent already read the source.' };
    await contextPrune(configured, { client, model: 'selected-model', signal });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ state: configured, model: 'selected-model' }),
      { signal },
    );
  });

  it('rejects a response missing an item answer and propagates provider errors', async () => {
    await expect(
      contextPrune(input, { client: createJevClient(answers([0.1, 0.9])) }),
    ).rejects.toBeInstanceOf(ZodError);
    const failure = new Error('Provider unavailable');
    const client = createJevClient();
    client.systemOne.mockRejectedValue(failure);
    await expect(contextPrune(input, { client })).rejects.toBe(failure);
  });

  testInputValidation(contextPrune, input, ['recent']);
});
