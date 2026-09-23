import { describe, expect, it } from 'vitest';
import { evidenceIndependence } from '../../recipes/evidence-independence/index.js';
import { testClassification } from './helpers/classification.js';
import { choiceAnswers, createJevClient } from './helpers/jev.js';

const input = {
  claim: 'The service outage began at 09:00.',
  firstProvenance:
    'Report A copies the start time from status notice N17 published by the service operator.',
  secondProvenance:
    'Report B cites Report A and repeats the start time from the same operator notice N17.',
};
const verdicts = ['shared_origin', 'separate_origins', 'unclear'] as const;

testClassification(evidenceIndependence, input, verdicts, []);

describe('evidence-independence review policy', () => {
  it('keeps an unresolved annotation in review at full confidence and a zero threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'unclear', 1));
    await expect(
      evidenceIndependence({ ...input, minConfidence: 0 }, { client }),
    ).resolves.toMatchObject({ verdict: 'unclear', confidence: 1, status: 'review' });
  });
  it('accepts a resolved annotation at the maximum threshold', async () => {
    const client = createJevClient(choiceAnswers('decision', verdicts, 'shared_origin', 1));
    await expect(
      evidenceIndependence({ ...input, minConfidence: 1 }, { client }),
    ).resolves.toMatchObject({ verdict: 'shared_origin', confidence: 1, status: 'ready' });
  });
});
