import { describe, expect, it } from 'vitest';
import { attributionMatch } from '../../recipes/attribution-match/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  statement: 'The deadline is Friday.',
  attributedTo: 'Mira',
  source: 'Oren: The deadline is Friday.\nMira: Thank you for the update.',
};
const verdicts = ['matched', 'mismatched', 'not_attributed', 'unclear'] as const;

testClassification(attributionMatch, input, verdicts, []);

describe('attribution-match review policy', () => {
  it('keeps an unresolved annotation in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      attributionMatch({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'mismatched', 1));
    await expect(
      attributionMatch({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({ verdict: 'mismatched', confidence: 1, status: 'ready' });
  });
});
