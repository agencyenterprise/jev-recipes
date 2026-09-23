import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { takeTurn } from '../../recipes/take-turn/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  player: 'Blue',
  rules: 'A challenge pauses the normal turn until the targeted player responds.',
  environment: 'Red has challenged Blue. The challenge is awaiting a response.',
};
const verdicts = ['act', 'wait', 'inactive', 'unclear'] as const;
testClassification(takeTurn, input, verdicts);

describe('take-turn history and review policy', () => {
  const histories = [
    [],
    [
      { player: 'Blue', action: 'Passed a prior turn.' },
      { player: 'Red', action: 'Challenged Blue.' },
    ],
    Array.from({ length: 100 }, () => ({ player: 'Red', action: 'Passed.' })),
  ];
  it.each(histories.map((history) => ({ history })))(
    'preserves $history.length ordered history entries alongside current state',
    async ({ history }) => {
      const client = createJevClient(choiceAnswers('decision', verdicts, 'act'));
      await takeTurn({ ...input, history }, { client });
      expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({ ...input, history });
    },
  );

  const invalidHistories = [
    [{ player: '  ', action: 'Passed.' }],
    [{ player: 'Red', action: '' }],
    [{ action: 'Passed.' }],
    Array.from({ length: 101 }, () => ({ player: 'Red', action: 'Passed.' })),
    'Red passed.',
  ];
  it.each(invalidHistories.map((history) => ({ history })))(
    'rejects invalid history before inference',
    async ({ history }) => {
      const client = createJevClient();
      await expect(
        takeTurn({ ...input, history } as Parameters<typeof takeTurn>[0], { client }),
      ).rejects.toBeInstanceOf(ZodError);
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );

  it('keeps unclear eligibility in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(takeTurn({ ...input, minConfidence: 0 }, { client })).resolves.toMatchObject({
      status: 'review',
      verdict: 'unclear',
    });
  });

  it.each(['act', 'wait', 'inactive'])(
    'keeps the %s verdict distinct from ready status at the maximum threshold',
    async (verdict) => {
      const client = createJevClient(choiceAnswers('decision', verdicts, verdict, 1));
      await expect(takeTurn({ ...input, minConfidence: 1 }, { client })).resolves.toMatchObject({
        status: 'ready',
        verdict,
        confidence: 1,
      });
    },
  );
});
