import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { rerank } from '../../recipes/rerank/index.js';
import { createJevClient, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  query: 'How do I reset my password?',
  items: [
    { id: 'billing', text: 'Invoices are available in Billing.' },
    { id: 'security', text: 'Use a strong password.' },
    { id: 'reset', text: 'Select Forgot password to receive a reset email.' },
  ],
};

describe('rerank', () => {
  it('filters irrelevant items, sorts by relevance, and returns only topK', async () => {
    const client = createJevClient(relevanceAnswers([0.2, 0.7, 0.95]));
    await expect(rerank({ ...input, topK: 1 }, { client })).resolves.toEqual({
      ...responseMetadata,
      status: 'ready',
      evaluated: 3,
      items: [{ ...input.items[2], relevance: 0.95 }],
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: input,
        questions: {
          item_0: { type: 'noul', instructions: expect.stringContaining('items[0].text') },
          item_1: { type: 'noul', instructions: expect.stringContaining('items[1].text') },
          item_2: { type: 'noul', instructions: expect.stringContaining('items[2].text') },
        },
      },
      {},
    );
  });

  it('includes the default relevance boundary and keeps tied items in their original order', async () => {
    const client = createJevClient(relevanceAnswers([0.499, 0.5, 0.5]));
    const result = await rerank(input, { client });
    expect(result.items).toEqual([
      { ...input.items[1], relevance: 0.5 },
      { ...input.items[2], relevance: 0.5 },
    ]);
  });

  it('defaults to at most five results', async () => {
    const items = Array.from({ length: 6 }, (_, index) => ({
      id: String(index),
      text: 'Reset instructions.',
    }));
    const client = createJevClient(relevanceAnswers([0.5, 0.6, 0.7, 0.8, 0.9, 1]));
    const result = await rerank({ query: input.query, items }, { client });
    expect(result.items.map((item) => item.id)).toEqual(['5', '4', '3', '2', '1']);
    expect(result.evaluated).toBe(6);
  });

  it('returns review when every item is below the requested threshold', async () => {
    const client = createJevClient(relevanceAnswers([0.5, 0.7, 0.89]));
    await expect(rerank({ ...input, minRelevance: 0.9 }, { client })).resolves.toMatchObject({
      status: 'review',
      items: [],
      evaluated: 3,
    });
  });

  it('accepts zero and one as relevance thresholds', async () => {
    for (const minRelevance of [0, 1]) {
      const client = createJevClient(relevanceAnswers([0, 0.5, 1]));
      const result = await rerank({ ...input, minRelevance }, { client });
      expect(result.items.map((item) => item.id)).toEqual(
        minRelevance === 0 ? ['reset', 'security', 'billing'] : ['reset'],
      );
    }
  });

  it.each([0, 101, 1.5])('rejects topK %s before calling Jev', async (topK) => {
    const client = createJevClient();
    await expect(rerank({ ...input, topK }, { client })).rejects.toBeInstanceOf(ZodError);
    expect(client.systemOne).not.toHaveBeenCalled();
  });

  it.each([
    undefined,
    { type: 'noul', noul: -0.1 },
    { type: 'noul', noul: 1.1 },
    { type: 'noul', noul: '0.9' },
    { type: 'choice', noul: 0.9 },
  ])('rejects malformed relevance responses: %j', async (answer) => {
    const client = createJevClient({ ...relevanceAnswers([0.9, 0.8, 0.7]), item_1: answer });
    await expect(rerank(input, { client })).rejects.toBeInstanceOf(ZodError);
  });

  it('forwards model and signal without changing caller input', async () => {
    const before = structuredClone(input);
    const signal = new AbortController().signal;
    const client = createJevClient(relevanceAnswers([0.1, 0.8, 0.9]));
    await rerank(input, { client, model: 'selected-model', signal });
    expect(client.systemOne).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'selected-model' }),
      { signal },
    );
    expect(input).toEqual(before);
  });

  it('propagates provider failures', async () => {
    const client = createJevClient();
    const failure = new Error('Provider unavailable');
    client.systemOne.mockRejectedValue(failure);
    await expect(rerank(input, { client })).rejects.toBe(failure);
  });

  testInputValidation(rerank, input, [], 100, 'minRelevance');
});

function relevanceAnswers(scores: number[]) {
  return Object.fromEntries(scores.map((noul, index) => ['item_' + index, { type: 'noul', noul }]));
}
