import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { citationMatch } from '../../recipes/citation-match/index.js';
import { batchAnswers, createJevClient, responseMetadata } from './helpers/jev.js';
import { testInputValidation } from './helpers/validation.js';

const input = {
  claim: 'Guests can export reports.',
  passages: [
    { id: 'policy', text: 'Guests may export reports.' },
    { id: 'guide', text: 'Report exports are available to guests.' },
  ],
};
const labels = ['supported', 'contradicted', 'unsupported'];

describe('citationMatch', () => {
  it('returns every independently supporting passage in the supplied order', async () => {
    const client = createJevClient(
      batchAnswers('claim', labels, [{ verdict: 'supported' }, { verdict: 'supported' }]),
    );
    await expect(citationMatch(input, { client })).resolves.toMatchObject({
      ...responseMetadata,
      status: 'ready',
      passageIds: ['policy', 'guide'],
    });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: {
          claims: [
            { id: 'policy', claim: input.claim, evidence: input.passages[0]!.text },
            { id: 'guide', claim: input.claim, evidence: input.passages[1]!.text },
          ],
        },
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

  it('returns ready with no matches when all passages confidently fail to support the claim', async () => {
    const client = createJevClient(
      batchAnswers('claim', labels, [{ verdict: 'contradicted' }, { verdict: 'unsupported' }]),
    );
    await expect(citationMatch(input, { client })).resolves.toMatchObject({
      status: 'ready',
      passageIds: [],
    });
  });

  it('requires review when no passage is confirmed and a check is uncertain', async () => {
    const client = createJevClient(
      batchAnswers('claim', labels, [
        { verdict: 'supported', confidence: 0.79 },
        { verdict: 'unsupported' },
      ]),
    );
    await expect(citationMatch(input, { client })).resolves.toMatchObject({
      status: 'review',
      passageIds: [],
      checks: [{ status: 'review' }, { status: 'ready' }],
    });
  });

  it('returns confirmed citations even when another passage remains uncertain', async () => {
    const client = createJevClient(
      batchAnswers('claim', labels, [
        { verdict: 'supported', confidence: 0.79 },
        { verdict: 'supported' },
      ]),
    );
    await expect(citationMatch(input, { client })).resolves.toMatchObject({
      status: 'ready',
      passageIds: ['guide'],
      checks: [{ status: 'review' }, { status: 'ready' }],
    });
  });

  it.each([
    { confidence: 0.8, minConfidence: 0.8, passageIds: ['policy', 'guide'] },
    { confidence: 0.9, minConfidence: 0.95, passageIds: [] },
    { confidence: 0.75, minConfidence: 0.7, passageIds: ['policy', 'guide'] },
  ])('passes threshold $minConfidence to verification', async (scenario) => {
    const client = createJevClient(
      batchAnswers(
        'claim',
        labels,
        input.passages.map(() => ({ verdict: 'supported', confidence: scenario.confidence })),
      ),
    );
    const signal = new AbortController().signal;
    await expect(
      citationMatch(
        { ...input, minConfidence: scenario.minConfidence },
        { client, model: 'selected-model', signal },
      ),
    ).resolves.toMatchObject({ passageIds: scenario.passageIds });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ model: 'selected-model' }),
      { signal },
    );
  });

  it('propagates verification failures without returning partial citations', async () => {
    const client = createJevClient(batchAnswers('claim', labels, [{ verdict: 'supported' }]));
    await expect(citationMatch(input, { client })).rejects.toBeInstanceOf(ZodError);
  });

  testInputValidation(citationMatch, input);
});
