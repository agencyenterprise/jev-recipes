import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { verify } from '../../recipes/verify/index.js';
import { batchAnswers, createJevClient, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  claims: [
    { id: 'guest-export', claim: 'Guests can export.', evidence: 'Guests may export reports.' },
    { id: 'owner-export', claim: 'Owners can export.', evidence: 'Owners may export reports.' },
  ],
};
const labels = ['supported', 'contradicted', 'unsupported'];

describe('verify', () => {
  it.each(labels)('preserves %s checks and computes allSupported', async (verdict) => {
    const answers = batchAnswers('claim', labels, [{ verdict }, { verdict }]);
    const client = createJevClient(answers);
    const result = await verify(input, { client });
    expect(result).toEqual({
      ...responseMetadata,
      allSupported: verdict === 'supported',
      checks: input.claims.map((claim, index) => ({
        id: claim.id,
        verdict,
        status: 'ready',
        confidence: 0.9,
        probabilities: answers['claim_' + index]!.probabilities,
      })),
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: input,
        questions: {
          claim_0: expect.objectContaining({
            instructions: expect.stringContaining('claims[0].evidence'),
          }),
          claim_1: expect.objectContaining({
            instructions: expect.stringContaining('claims[1].evidence'),
          }),
        },
      },
      {},
    );
  });

  it('requires every claim to be supported', async () => {
    const client = createJevClient(
      batchAnswers('claim', labels, [{ verdict: 'supported' }, { verdict: 'contradicted' }]),
    );
    await expect(verify(input, { client })).resolves.toMatchObject({
      allSupported: false,
      checks: [
        { id: 'guest-export', verdict: 'supported' },
        { id: 'owner-export', verdict: 'contradicted' },
      ],
    });
  });

  it.each([
    { confidence: 0.79, minConfidence: undefined, status: 'review', allSupported: false },
    { confidence: 0.8, minConfidence: undefined, status: 'ready', allSupported: true },
    { confidence: 0.9, minConfidence: 0.95, status: 'review', allSupported: false },
    { confidence: 0.75, minConfidence: 0.7, status: 'ready', allSupported: true },
  ])('handles confidence $confidence with threshold $minConfidence', async (scenario) => {
    const client = createJevClient(
      batchAnswers('claim', labels, [
        { verdict: 'supported' },
        { verdict: 'supported', confidence: scenario.confidence },
      ]),
    );
    const configuredInput =
      scenario.minConfidence === undefined
        ? input
        : { ...input, minConfidence: scenario.minConfidence };
    const result = await verify(configuredInput, { client });
    expect(result.allSupported).toBe(scenario.allSupported);
    expect(result.checks[1]?.status).toBe(scenario.status);
  });

  it('rejects a missing claim response rather than treating it as unsupported', async () => {
    const client = createJevClient(batchAnswers('claim', labels, [{ verdict: 'supported' }]));
    await expect(verify(input, { client })).rejects.toBeInstanceOf(ZodError);
  });

  testInputValidation(verify, input, [], 100);
});
