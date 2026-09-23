import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { chooseAction } from '../../recipes/choose-action/index.js';
import { testSelection } from './helpers/selection.js';
import { choiceAnswer, choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  player: 'Blue',
  objective: 'Retain as many points as possible in the final round.',
  rules: 'Defend with a shield or concede two points. Unused shields have no score.',
  environment: 'Blue must respond to a challenge and has one shield.',
  actions: [
    { id: 'defend', text: 'Spend one shield to stop the challenge.' },
    { id: 'concede', text: 'Accept the challenge and lose two points.' },
  ],
};
const labels = ['candidate_0', 'candidate_1', 'none', 'ambiguous'];
testSelection(chooseAction, input, 'actions');

describe('choose-action history and review handling', () => {
  const histories = [
    [],
    [
      { player: 'Red', action: 'Challenged Blue.' },
      { player: 'Blue', action: 'Requested clarification.' },
    ],
    Array.from({ length: 100 }, () => ({ player: 'Red', action: 'Passed.' })),
  ];
  it.each(histories.map((history) => ({ history })))(
    'forwards history with $history.length entries in its original order',
    async ({ history }) => {
      const client = createJevClient(choiceAnswers('decision', labels, 'candidate_0'));
      await chooseAction({ ...input, history }, { client });
      expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({ ...input, history });
    },
  );

  const invalidHistories = [
    [{ player: '', action: 'Passed.' }],
    [{ player: 'Red', action: '  ' }],
    [{ player: 'Red' }],
    Array.from({ length: 101 }, () => ({ player: 'Red', action: 'Passed.' })),
    'Red passed.',
  ];
  it.each(invalidHistories.map((history) => ({ history })))(
    'rejects invalid history before inference',
    async ({ history }) => {
      const client = createJevClient();
      await expect(
        chooseAction({ ...input, history } as Parameters<typeof chooseAction>[0], { client }),
      ).rejects.toBeInstanceOf(ZodError);
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );

  it.each(['', '   '])('rejects a blank action description %j before inference', async (text) => {
    const client = createJevClient();
    await expect(
      chooseAction({ ...input, actions: [{ id: 'defend', text }] }, { client }),
    ).rejects.toBeInstanceOf(ZodError);
    expect(client.systemOne).not.toHaveBeenCalled();
  });

  it('keeps ambiguous choices in review even at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', labels, 'ambiguous', 1));
    await expect(chooseAction({ ...input, minConfidence: 0 }, { client })).resolves.toMatchObject({
      status: 'review',
      verdict: 'ambiguous',
      selection: null,
      suggestedSelection: null,
    });
  });

  it.each([1, 50])('maps a selected candidate from a list of %i actions', async (count) => {
    const actions = Array.from({ length: count }, (_, index) => ({
      id: `action-${index}`,
      text: `Action ${index}`,
    }));
    const choices = [...actions.map((_, index) => `candidate_${index}`), 'none', 'ambiguous'];
    const client = createJevClient(choiceAnswers('decision', choices, `candidate_${count - 1}`, 1));
    await expect(
      chooseAction({ ...input, actions, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({ status: 'ready', selection: `action-${count - 1}` });
  });

  it.each([
    undefined,
    { ...choiceAnswer(labels, 'candidate_0'), probabilities: {} },
    { ...choiceAnswer(labels, 'candidate_0'), confidence: 2 },
    {
      ...choiceAnswer(labels, 'candidate_0'),
      probabilities: Object.fromEntries(labels.map((key) => [key, 0.01])),
    },
    { ...choiceAnswer(labels, 'candidate_0'), choice: 'candidate_1' },
  ])('rejects malformed or inconsistent model answers', async (answer) => {
    const client = createJevClient({ decision: answer });
    await expect(chooseAction(input, { client })).rejects.toBeInstanceOf(ZodError);
  });
});
