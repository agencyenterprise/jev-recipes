import { noveltyClaimLevel } from '../../recipes/novelty-claim-level/index.js';
import { testScore } from './helpers/score.js';

testScore(
  noveltyClaimLevel,
  {
    statement:
      'To the best of our knowledge, this is the first study to demonstrate that the effect transfers across species, a result no existing theoretical framework predicted.',
  },
  ['none', 'incremental', 'notable', 'substantial', 'unprecedented'],
  'novelty',
);
