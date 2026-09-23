import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import {
  gameAction,
  gameActionInputSchema,
  gameActionResultSchema,
} from '../../recipes/game-action/index.js';
import type { GameActionInput } from '../../recipes/game-action/index.js';
import { choiceAnswer, createJevClient, responseMetadata } from './helpers/jev.js';

const input: GameActionInput = {
  gameState: { round: 3, players: ['red', 'blue'], terrain: [['forest', null]] },
  playerState: { id: 'blue', units: [{ id: 'scout-7', energy: 2 }] },
  legalActions: [
    { id: 'game-move-42', unit: 'scout-7', command: 'move', destination: [2, 4] },
    { unit: 'scout-7', command: 'rest' },
  ],
};
const labels = ['action_0', 'action_1'];
const jsonValues = [
  null,
  false,
  true,
  0,
  -1.5,
  '',
  'wait',
  [],
  [1, null, { nested: ['value', false] }],
  {},
  { id: 'existing-id', arbitrary: { values: [null, true, 3] } },
] satisfies GameActionInput['legalActions'];

describe('game-action', () => {
  it.each([0, 1])('returns the original action at index %i in one request', async (index) => {
    const answer = choiceAnswer(labels, `action_${index}`);
    const client = createJevClient({ decision: answer });
    const result = await gameAction(input, { client });
    expect(result).toEqual({
      ...responseMetadata,
      selection: `action_${index}`,
      action: input.legalActions[index],
      confidence: answer.confidence,
      probabilities: answer.probabilities,
    });
    expect(gameActionResultSchema.parse(result)).toEqual(result);
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      {
        state: { gameState: input.gameState, playerState: input.playerState },
        questions: {
          decision: {
            type: 'choice',
            instructions: [
              'Which available action should this player take next, given the supplied game state, player state, rules, and objective?',
              'gameState: The current game information available for this decision.',
              'playerState: Information about the player making this decision.',
              'legalActions: The available actions the player can choose from.',
              'rules: Game rules and explanations of game-specific information.',
              'objective: What the player is trying to accomplish.',
            ].join('\n'),
            criteria: {
              action_0:
                '{"id":"game-move-42","unit":"scout-7","command":"move","destination":[2,4]}',
              action_1: '{"unit":"scout-7","command":"rest"}',
            },
          },
        },
      },
      {},
    );
  });

  it.each(jsonValues.map((value) => ({ value })))(
    'preserves arbitrary JSON state and optional context: $value',
    async ({ value }) => {
      const context = { gameState: value, playerState: value, rules: value, objective: value };
      const client = createJevClient({ decision: choiceAnswer(labels, 'action_0') });
      await gameAction({ ...input, ...context }, { client });
      expect(client.systemOne.mock.calls[0]?.[0].state).toEqual(context);
    },
  );

  it.each(jsonValues.map((action) => ({ action })))(
    'returns arbitrary JSON actions unchanged: $action',
    async ({ action }) => {
      const client = createJevClient({ decision: choiceAnswer(['action_0'], 'action_0', 1) });
      const result = await gameAction({ ...input, legalActions: [action] }, { client });
      expect(result).toEqual({
        ...responseMetadata,
        selection: 'action_0',
        action,
        confidence: 1,
        probabilities: { action_0: 1 },
      });
      expect(client.systemOne).toHaveBeenCalledOnce();
      expect(client.systemOne.mock.calls[0]?.[0].questions.decision?.criteria).toEqual({
        action_0: JSON.stringify(action),
      });
    },
  );

  it('supports mixed JSON types in the same action list', async () => {
    const choices = jsonValues.map((_, index) => `action_${index}`);
    const client = createJevClient({ decision: choiceAnswer(choices, 'action_5') });
    const result = await gameAction({ ...input, legalActions: jsonValues }, { client });
    expect(result?.action).toBe('');
    expect(Object.keys(result!.probabilities)).toEqual(choices);
    expect(client.systemOne.mock.calls[0]?.[0].questions.decision?.criteria).toEqual({
      action_0: 'null',
      action_1: 'false',
      action_2: 'true',
      action_3: '0',
      action_4: '-1.5',
      action_5: '""',
      action_6: '"wait"',
      action_7: '[]',
      action_8: '[1,null,{"nested":["value",false]}]',
      action_9: '{}',
      action_10: '{"id":"existing-id","arbitrary":{"values":[null,true,3]}}',
    });
  });

  it.each(['action_0', 'none', 'ambiguous', '__proto__', 'constructor', '', 42, null])(
    'preserves existing game ID %j, including duplicate IDs',
    async (id) => {
      const legalActions = [
        { id, command: 'wait' },
        { id, command: 'wait' },
      ];
      const client = createJevClient({ decision: choiceAnswer(labels, 'action_1') });
      const result = await gameAction({ ...input, legalActions }, { client });
      expect(result?.selection).toBe('action_1');
      expect(result?.action).toEqual({ id, command: 'wait' });
      expect(Object.keys(result!.probabilities)).toEqual(labels);
      expect(legalActions).toEqual([
        { id, command: 'wait' },
        { id, command: 'wait' },
      ]);
    },
  );

  it.each([51, 255])('forwards all %i actions and returns the final one', async (count) => {
    const legalActions = Array.from({ length: count }, (_, index) => ({ destination: index }));
    const choices = legalActions.map((_, index) => `action_${index}`);
    const client = createJevClient({ decision: choiceAnswer(choices, `action_${count - 1}`) });
    const result = await gameAction({ ...input, legalActions }, { client });
    expect(result?.selection).toBe(`action_${count - 1}`);
    expect(result?.action).toEqual({ destination: count - 1 });
    expect(Object.keys(result!.probabilities)).toEqual(choices);
    expect(client.systemOne).toHaveBeenCalledOnce();
    expect(client.systemOne.mock.calls[0]?.[0].questions.decision?.criteria).toEqual(
      Object.fromEntries(
        legalActions.map((action, index) => [`action_${index}`, JSON.stringify(action)]),
      ),
    );
  });

  it.each([0, 0.2, 0.8, 1])(
    'preserves Jev confidence %s without a threshold',
    async (confidence) => {
      const answer = { ...choiceAnswer(labels, 'action_1'), confidence };
      const client = createJevClient({ decision: answer });
      const result = await gameAction(input, { client });
      expect(result?.selection).toBe('action_1');
      expect(result?.action).toEqual(input.legalActions[1]);
      expect(result?.confidence).toBe(confidence);
      expect(result).not.toHaveProperty('status');
    },
  );

  it("keeps Jev's selected action when probabilities tie", async () => {
    const client = createJevClient({
      decision: {
        type: 'choice',
        choice: 'action_1',
        confidence: 0,
        probabilities: { action_0: 0.5, action_1: 0.5 },
      },
    });
    const result = await gameAction(input, { client });
    expect(result?.selection).toBe('action_1');
    expect(result?.action).toEqual(input.legalActions[1]);
  });

  it('returns null without contacting Jev when no actions are available', async () => {
    const client = createJevClient();
    await expect(gameAction({ ...input, legalActions: [] }, { client })).resolves.toBeNull();
    expect(client.systemOne).not.toHaveBeenCalled();
    await expect(gameAction({ ...input, legalActions: [] })).resolves.toBeNull();
    expect(gameActionResultSchema.parse(null)).toBeNull();
  });

  it("leaves the caller's JSON unchanged", async () => {
    const original = structuredClone(input);
    const client = createJevClient({ decision: choiceAnswer(labels, 'action_0') });
    await gameAction(input, { client });
    expect(input).toEqual(original);
  });

  it('forwards model and abort signal', async () => {
    const signal = new AbortController().signal;
    const client = createJevClient({ decision: choiceAnswer(labels, 'action_0') });
    await gameAction(input, { client, model: 'chosen-model', signal });
    expect(client.systemOne).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ model: 'chosen-model' }),
      { signal },
    );
  });

  it('propagates provider failure without retrying the decision', async () => {
    const failure = new Error('Provider unavailable');
    const client = createJevClient();
    client.systemOne.mockRejectedValue(failure);
    await expect(gameAction(input, { client })).rejects.toBe(failure);
    expect(client.systemOne).toHaveBeenCalledOnce();
  });
});

describe('game-action validation', () => {
  it.each(['gameState', 'playerState', 'legalActions'])(
    'rejects missing %s before inference',
    async (field) => {
      const incomplete: Record<string, unknown> = { ...input };
      delete incomplete[field];
      const client = createJevClient();
      expect(gameActionInputSchema.safeParse(incomplete).success).toBe(false);
      await expect(gameAction(incomplete as GameActionInput, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );

  const invalidInputs = [
    null,
    undefined,
    {},
    { ...input, legalActions: null },
    { ...input, legalActions: 'wait' },
    { ...input, gameState: { nested: undefined } },
    { ...input, playerState: new Date() },
    { ...input, rules: () => 'rules' },
    { ...input, objective: Number.NaN },
    { ...input, legalActions: [undefined] },
    { ...input, legalActions: [Number.POSITIVE_INFINITY] },
    { ...input, legalActions: [1n] },
    { ...input, legalActions: [{ command: () => {} }] },
    { ...input, legalActions: [], gameState: undefined },
  ];
  it.each(invalidInputs.map((value, index) => ({ value, index })))(
    'rejects malformed input $index before inference',
    async ({ value }) => {
      const client = createJevClient();
      await expect(gameAction(value as GameActionInput, { client })).rejects.toBeInstanceOf(
        ZodError,
      );
      expect(client.systemOne).not.toHaveBeenCalled();
    },
  );

  const validAnswer = choiceAnswer(labels, 'action_0');
  const invalidAnswers = [
    undefined,
    { ...validAnswer, type: 'noul' },
    { ...validAnswer, choice: 'unlisted' },
    { ...validAnswer, choice: 'game-move-42' },
    { ...validAnswer, choice: 'action_2' },
    { ...validAnswer, choice: 'none' },
    { ...validAnswer, choice: 'ambiguous' },
    { ...validAnswer, confidence: -0.1 },
    { ...validAnswer, confidence: 1.1 },
    { ...validAnswer, probabilities: {} },
    { ...validAnswer, probabilities: { action_0: 1 } },
    { ...validAnswer, probabilities: { action_0: 0.9, action_1: 0.1, extra: 0 } },
    { ...validAnswer, probabilities: { action_0: -0.1, action_1: 1.1 } },
    { ...validAnswer, probabilities: { action_0: 0.1, action_1: 0.1 } },
    { ...validAnswer, choice: 'action_1' },
  ];
  it.each(invalidAnswers.map((answer, index) => ({ answer, index })))(
    'rejects malformed response $index',
    async ({ answer }) => {
      const client = createJevClient({ decision: answer });
      await expect(gameAction(input, { client })).rejects.toBeInstanceOf(ZodError);
    },
  );
});
