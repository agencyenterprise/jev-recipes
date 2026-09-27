import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { routeMany } from '../../recipes/route-many/index.js';
import type { DecisionClient } from '../../src/schema.js';
import { choiceAnswer, createJevClient, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const routes = {
  billing: 'Payments, invoices, subscriptions, and refunds',
  technical: 'Errors, outages, and broken product features',
};
const labels = [...Object.keys(routes), '__review__'];
const input = {
  requests: [
    { id: 'a', text: 'I was charged twice.' },
    { id: 'b', text: 'The export button throws a 500.' },
    { id: 'c', text: 'hi' },
  ],
  routes,
};

function answers(picks: { choice: string; confidence?: number }[]) {
  return Object.fromEntries(
    picks.map((pick, index) => [
      `request_${index}`,
      choiceAnswer(labels, pick.choice, pick.confidence ?? 0.9),
    ]),
  );
}

describe('routeMany', () => {
  it('routes every request in one call when the batch fits', async () => {
    const client = createJevClient(
      answers([{ choice: 'billing' }, { choice: 'technical' }, { choice: '__review__' }]),
    );
    await expect(routeMany(input, { client })).resolves.toEqual({
      ...responseMetadata,
      status: 'review',
      items: [
        {
          id: 'a',
          status: 'ready',
          route: 'billing',
          suggestedRoute: 'billing',
          confidence: 0.9,
          probabilities: expect.objectContaining({ billing: 0.9 }),
        },
        {
          id: 'b',
          status: 'ready',
          route: 'technical',
          suggestedRoute: 'technical',
          confidence: 0.9,
          probabilities: expect.objectContaining({ technical: 0.9 }),
        },
        {
          id: 'c',
          status: 'review',
          route: null,
          suggestedRoute: null,
          confidence: 0.9,
          probabilities: expect.objectContaining({ __review__: 0.9 }),
        },
      ],
      routed: 2,
      requestCount: 3,
      requestsMade: 1,
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: { requests: input.requests, routes },
        questions: {
          request_0: {
            type: 'choice',
            instructions: expect.stringContaining('requests[0].text'),
            criteria: { ...routes, __review__: expect.any(String) },
          },
          request_1: expect.objectContaining({
            instructions: expect.stringContaining('requests[1].text'),
          }),
          request_2: expect.objectContaining({
            instructions: expect.stringContaining('requests[2].text'),
          }),
        },
      },
      {},
    );
  });

  it('splits requests into batches, merges results in order, and sums usage', async () => {
    const systemOne = vi
      .fn<DecisionClient['systemOne']>()
      .mockResolvedValueOnce({
        model: 'batch-model',
        usage: { input_tokens: 100, output_tokens: 10 },
        answers: answers([{ choice: 'billing' }, { choice: 'technical' }]),
      })
      .mockResolvedValueOnce({
        model: 'batch-model',
        usage: { input_tokens: 50, output_tokens: 5 },
        answers: answers([{ choice: 'billing', confidence: 0.85 }]),
      });
    const result = await routeMany({ ...input, batchSize: 2 }, { client: { systemOne } });
    expect(result).toMatchObject({
      status: 'ready',
      model: 'batch-model',
      usage: { input_tokens: 150, output_tokens: 15 },
      routed: 3,
      requestCount: 3,
      requestsMade: 2,
    });
    expect(result.items.map((item) => [item.id, item.route])).toEqual([
      ['a', 'billing'],
      ['b', 'technical'],
      ['c', 'billing'],
    ]);
    expect(systemOne).toHaveBeenCalledTimes(2);
    expect(systemOne.mock.calls[0]?.[0].state).toEqual({
      requests: input.requests.slice(0, 2),
      routes,
    });
    expect(systemOne.mock.calls[1]?.[0].state).toEqual({
      requests: input.requests.slice(2),
      routes,
    });
  });

  it('keeps a low-confidence route as a suggestion and honors minConfidence', async () => {
    const client = createJevClient(
      answers([
        { choice: 'billing', confidence: 0.75 },
        { choice: 'technical' },
        { choice: 'billing' },
      ]),
    );
    const result = await routeMany(input, { client });
    expect(result.items[0]).toMatchObject({
      status: 'review',
      route: null,
      suggestedRoute: 'billing',
    });
    expect(result.routed).toBe(2);
    await expect(routeMany({ ...input, minConfidence: 0.7 }, { client })).resolves.toMatchObject({
      status: 'ready',
      routed: 3,
    });
  });

  it('forwards the model and abort signal to every batch', async () => {
    const signal = new AbortController().signal;
    const client = createJevClient(answers([{ choice: 'billing' }]));
    await routeMany(
      { ...input, requests: input.requests.slice(0, 2), batchSize: 1 },
      { client, model: 'selected-model', signal },
    );
    expect(client.systemOne).toHaveBeenCalledTimes(2);
    for (const call of client.systemOne.mock.calls) {
      expect(call[0]).toEqual(expect.objectContaining({ model: 'selected-model' }));
      expect(call[1]).toEqual({ signal });
    }
  });

  it('rejects reserved route names, bad batch sizes, and too many requests before calling Jev', async () => {
    const client = createJevClient();
    await expect(
      routeMany({ ...input, routes: { ...routes, __review__: 'x' } }, { client }),
    ).rejects.toBeInstanceOf(ZodError);
    await expect(routeMany({ ...input, routes: {} }, { client })).rejects.toBeInstanceOf(ZodError);
    for (const batchSize of [0, 51, 1.5]) {
      await expect(routeMany({ ...input, batchSize }, { client })).rejects.toBeInstanceOf(ZodError);
    }
    const requests = Array.from({ length: 501 }, (_, index) => ({ id: String(index), text: 'x' }));
    await expect(routeMany({ ...input, requests }, { client })).rejects.toBeInstanceOf(ZodError);
    expect(client.systemOne).not.toHaveBeenCalled();
  });

  it('rejects a batch missing an answer and propagates provider errors', async () => {
    await expect(
      routeMany(input, { client: createJevClient(answers([{ choice: 'billing' }])) }),
    ).rejects.toBeInstanceOf(ZodError);
    const failure = new Error('Provider unavailable');
    const client = createJevClient();
    client.systemOne.mockRejectedValue(failure);
    await expect(routeMany(input, { client })).rejects.toBe(failure);
  });

  testInputValidation(routeMany, input, [], null);
});
