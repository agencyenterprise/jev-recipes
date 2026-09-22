import { toneCheck } from '../../recipes/tone-check/index.js';
import { testBatch } from './helpers/batch.js';

testBatch(
  toneCheck,
  {
    draft: 'You caused this problem. Read the manual.',
    criteria: [
      {
        id: 'blame',
        text: 'Avoid blaming the customer.',
      },
      {
        id: 'plain-language',
        text: 'Use plain language.',
      },
    ],
  },
  'criteria',
  ['pass', 'fail', 'unclear'],
  'pass',
  'allPassed',
);
