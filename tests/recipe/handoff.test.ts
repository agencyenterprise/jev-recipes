import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { handoff } from '../../recipes/handoff/index.js';
import { batchAnswers, createJevClient, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  request: 'I need help with my account.',
  rules: [
    { id: 'human-request', description: 'The customer asks for a person.' },
    { id: 'unresolved', description: 'The issue remains unresolved after troubleshooting.' },
  ],
};
const labels = ['matches', 'does_not_match', 'unclear'];

describe('handoff', () => {
  it.each([
    {
      verdict: 'matches',
      decision: 'human',
      status: 'ready',
      matchedRules: ['human-request', 'unresolved'],
      uncertainRules: [],
    },
    {
      verdict: 'does_not_match',
      decision: 'continue',
      status: 'ready',
      matchedRules: [],
      uncertainRules: [],
    },
    {
      verdict: 'unclear',
      decision: 'review',
      status: 'review',
      matchedRules: [],
      uncertainRules: ['human-request', 'unresolved'],
    },
  ])('returns $decision for confidently $verdict rules', async (scenario) => {
    const client = createJevClient(
      batchAnswers(
        'rule',
        labels,
        input.rules.map(() => ({ verdict: scenario.verdict })),
      ),
    );
    await expect(handoff(input, { client })).resolves.toMatchObject({
      ...responseMetadata,
      decision: scenario.decision,
      status: scenario.status,
      matchedRules: scenario.matchedRules,
      uncertainRules: scenario.uncertainRules,
      checks: [{ status: 'ready' }, { status: 'ready' }],
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: { ...input, context: '' },
        questions: {
          rule_0: expect.objectContaining({
            instructions: expect.stringContaining('rules[0].description'),
          }),
          rule_1: expect.objectContaining({
            instructions: expect.stringContaining('rules[1].description'),
          }),
        },
      },
      {},
    );
  });

  it('hands off for a confirmed match even when another rule is uncertain', async () => {
    const client = createJevClient(
      batchAnswers('rule', labels, [{ verdict: 'matches' }, { verdict: 'unclear' }]),
    );
    await expect(handoff(input, { client })).resolves.toMatchObject({
      decision: 'human',
      status: 'ready',
      matchedRules: ['human-request'],
      uncertainRules: ['unresolved'],
    });
  });

  it.each(['matches', 'does_not_match'])(
    'requires review for a low-confidence %s without a confirmed match',
    async (verdict) => {
      const client = createJevClient(
        batchAnswers('rule', labels, [
          { verdict, confidence: 0.79 },
          { verdict: 'does_not_match' },
        ]),
      );
      await expect(handoff(input, { client })).resolves.toMatchObject({
        decision: 'review',
        matchedRules: [],
        uncertainRules: ['human-request'],
      });
    },
  );

  it.each([
    { confidence: 0.8, minConfidence: 0.8, decision: 'human' },
    { confidence: 0.9, minConfidence: 0.95, decision: 'review' },
    { confidence: 0.75, minConfidence: 0.7, decision: 'human' },
  ])('honors threshold $minConfidence and supplied context', async (scenario) => {
    const client = createJevClient(
      batchAnswers(
        'rule',
        labels,
        input.rules.map(() => ({ verdict: 'matches', confidence: scenario.confidence })),
      ),
    );
    await expect(
      handoff(
        {
          ...input,
          context: 'The customer asked for a person.',
          minConfidence: scenario.minConfidence,
        },
        { client },
      ),
    ).resolves.toMatchObject({ decision: scenario.decision });
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      ...input,
      context: 'The customer asked for a person.',
    });
  });

  it('rejects a missing rule response', async () => {
    const client = createJevClient(batchAnswers('rule', labels, [{ verdict: 'matches' }]));
    await expect(handoff(input, { client })).rejects.toBeInstanceOf(ZodError);
  });

  testInputValidation(handoff, input);
});
